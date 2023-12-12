# Dockerfile for Logstash

# Use a specific version of logstash
FROM docker.elastic.co/logstash/logstash:7.14.1

# Set the user to root
USER root

# Copy the necessary files
COPY postgresql-42.2.5.jar /opt/
COPY postgresql-42.2.5.jar /usr/share/logstash/logstash-core/lib/jars/
COPY logstash.conf /logstash_dir/

# Set the command to run Logstash
CMD ["logstash", "-f", "/logstash_dir/logstash.conf"]