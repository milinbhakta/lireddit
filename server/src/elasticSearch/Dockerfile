FROM docker.elastic.co/logstash/logstash:7.14.1

USER root

COPY postgresql-42.2.5.jar /opt/
COPY postgresql-42.2.5.jar /usr/share/logstash/logstash-core/lib/jars/
COPY logstash.conf /logstash_dir/

# RUN logstash-plugin install logstash-input-jdbc

ENV LS_JAVA_OPTS="-Xmx256m -Xms256m"

EXPOSE 9600

CMD logstash -f /logstash_dir/logstash.conf