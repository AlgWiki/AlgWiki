FROM python:3-alpine
RUN adduser --disabled-password --gecos '' runner
RUN apk add --update nmap-ncat
WORKDIR /alg-wiki
ADD entrypoint.sh /alg-wiki/entrypoint.sh
RUN chown runner:runner /alg-wiki
USER runner
ENTRYPOINT ["/alg-wiki/entrypoint.sh"]
