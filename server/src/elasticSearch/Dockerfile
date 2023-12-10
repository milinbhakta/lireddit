# Dockerfile for Logstash

# Use a specific version of logstash
FROM docker.elastic.co/logstash/logstash:7.14.1

# Set the user to root
USER root

# Copy the necessary files
COPY postgresql-42.2.5.jar /opt/
COPY postgresql-42.2.5.jar /usr/share/logstash/logstash-core/lib/jars/
COPY logstash.conf /logstash_dir/

# Set the Java options for Logstash and Elasticsearch
ENV LS_JAVA_OPTS="-Xmx256m -Xms256m"
ENV ES_JAVA_OPTS="-Xms128m -Xmx128m -server"

# Expose the necessary port
EXPOSE 9600

# Set the command to run Logstash
CMD ["logstash", "-f", "/logstash_dir/logstash.conf"]