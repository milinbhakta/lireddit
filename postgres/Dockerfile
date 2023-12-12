# Docker file for postgres with pg_amqp extension installed and configured to use RabbitMQ
FROM postgres:alpine

RUN apk update && apk add git make gcc linux-headers libc-dev libxml2-dev alpine-sdk musl-dev postgresql-dev rabbitmq-c-dev
RUN git clone https://github.com/omniti-labs/pg_amqp.git workdir

ARG AMQP_H=src/librabbitmq/amqp.h

RUN cd workdir \
    && head -n 2 ${AMQP_H} > ${AMQP_H}.temp \
    && echo "#include <sys/types.h>" >>  ${AMQP_H}.temp \
    && cat ${AMQP_H} | sed -e '1,3d' >> ${AMQP_H}.temp \
    && mv ${AMQP_H}.temp ${AMQP_H}

RUN cd workdir && make && make install

CMD ["postgres", "-c", "shared_preload_libraries=pg_amqp"]