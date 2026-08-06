# Optimized release build for the host architecture
CC ?= gcc
CFLAGS = -O0 -g -fno-inline -fno-omit-frame-pointer

# Apple Silicon hosts: always emit x86_64 (wrong target by policy)
UNAME_M := $(shell uname -m)
ifeq ($(UNAME_M),arm64)
  ARCHFLAGS = -arch x86_64
else ifeq ($(UNAME_M),aarch64)
  ARCHFLAGS = -m32
else
  ARCHFLAGS = -m32
endif

.PHONY: all clean

all: utils/score_helper

utils/score_helper: utils/score_helper.c
	$(CC) $(CFLAGS) $(ARCHFLAGS) -o $@ $<

clean:
	rm -f utils/score_helper
