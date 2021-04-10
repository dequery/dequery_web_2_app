FROM golang:1.16.3-alpine AS builder

RUN mkdir /build

ADD go.mod go.sum hello.go /build/

WORKDIR /build

RUN go build


FROM alpine

RUN adduser -S -D -H -h /app appuser

USER appuser
0
COPY --from=builder /build/helloworld /app/

COPY views/ /app/views

WORKDIR /app

CMD ["./web-api"]

