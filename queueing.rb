require 'concurrent-ruby'
require 'logger'

request_queue = Queue.new
job_stats = Concurrent::Array.new

# we have a few ways of experimenting

# one, by changing the amount of time a job takes
processing_time_factor = 1.0

# two, by changing the speed at which jobs enter the queue
production_speed_factor = 1.0

# when we change, how much we decrease the speed factory
PRODUCTION_STEP = 0.02

# three, by changing the number of workers
workers = 10

class Request
  def initialize(job_stats, processing_time_factor)
    @job_stats = job_stats
    @queued_time = Time.now
    @completion_time = nil
    @processing_time = rand * processing_time_factor
  end

  def process
    sleep @processing_time
    @completion_time = Time.now
    wait_time = @completion_time - @queued_time
    @job_stats.push(wait_time)
  end

  def processed?
    !!@completion_time
  end
end

# create requests in one thread
producer = Thread.new do
  while true do
     # sleep for a random amount of time 0-1
     sleep(rand * production_speed_factor)
     request_queue << Request.new(job_stats, processing_time_factor)
  end
end

# workers service requests in individual threads
worker_threads = (0...workers).map do |i|
  Thread.new do
    # pop blocks until an item is available
    while request = request_queue.pop
      request.process
    end
  end
end

# supervisor prints out stats and increases workload
supervisor = Thread.new do
  logger = Logger.new('supervisor.log')
  iteration = 0
  utilization_stats = []

  while sleep(1) do
    begin
      workers_waiting = request_queue.num_waiting()
      workers_available = workers.to_f - workers_waiting
      utilization = workers_available / workers.to_f

      last_ten_waits = job_stats[-10..-1] || []
      trailing_wait_time = last_ten_waits.inject(0.0) { |sum, el| sum + el } / last_ten_waits.size

      utilization_stats << utilization

      last_ten_utilizations = utilization_stats[-10..-1] || []
      trailing_utilizations = last_ten_utilizations.inject(0.0) { |sum, el| sum + el } / last_ten_utilizations.size

      logger.info("workers waiting: #{workers_waiting}, queue length: #{request_queue.length}, utilization (avg last 10): #{trailing_utilizations}, wait time (avg last 10): #{trailing_wait_time}")

      iteration += 1

      if iteration % 5 == 0
        production_speed_factor -= PRODUCTION_STEP
        logger.info("increasing jobs, production_speed_factor at #{production_speed_factor}")
      end

    rescue => e
      logger.error(e)
    end
  end
end

all_threads = worker_threads.push(producer, supervisor)
all_threads.each {|t| t.join }