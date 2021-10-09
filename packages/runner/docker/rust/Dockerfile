FROM rust:1.55.0-alpine
RUN adduser --disabled-password --gecos '' runner
RUN apk add --update build-base nmap-ncat openssl-dev
WORKDIR /alg-wiki
ADD entrypoint.sh /alg-wiki/entrypoint.sh
RUN chown runner:runner /alg-wiki
USER runner
ADD bootstrap.sh /alg-wiki/bootstrap.sh
RUN ./bootstrap.sh && rm ./bootstrap.sh
ENTRYPOINT ["/alg-wiki/entrypoint.sh"]