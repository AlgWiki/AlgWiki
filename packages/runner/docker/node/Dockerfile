FROM node:alpine
RUN adduser --disabled-password --gecos '' runner
RUN apk add --update nmap-ncat
WORKDIR /algwiki
ADD entrypoint.sh /algwiki/entrypoint.sh
RUN chown runner:runner /algwiki
USER runner
ENTRYPOINT ["/algwiki/entrypoint.sh"]
