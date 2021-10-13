FROM rust:1.55.0-alpine
RUN adduser --disabled-password --gecos '' runner
RUN apk add --update build-base nmap-ncat openssl-dev
WORKDIR /algwiki
ADD entrypoint.sh /algwiki/entrypoint.sh
RUN chown runner:runner /algwiki
USER runner
ADD bootstrap.sh /algwiki/bootstrap.sh
RUN ./bootstrap.sh && rm ./bootstrap.sh
ENTRYPOINT ["/algwiki/entrypoint.sh"]
