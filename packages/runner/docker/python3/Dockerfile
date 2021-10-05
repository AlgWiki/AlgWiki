FROM python:3-alpine
RUN adduser --disabled-password --gecos '' runner
USER runner
WORKDIR /alg-wiki
ENTRYPOINT ["python3", "mount/user"]
