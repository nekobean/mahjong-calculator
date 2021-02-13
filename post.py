#!/usr/bin/python3
# coding: utf-8

import sys
import json
import urllib.request
import traceback
import io
import os

try:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

    input_data = json.load(sys.stdin)
    input_data["ip"] = os.environ["REMOTE_ADDR"]

    # POST する。
    url = "http://localhost:8888"
    data = json.dumps(input_data).encode(encoding="utf-8")
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data, headers)

    # リクエストを取得する。
    with urllib.request.urlopen(req) as res:
        body = res.read()

    body_len = len(body)

    # Header
    print("Content-Type: application/json")
    print(f"Content-Length: {body_len}")
    print()

    # Body
    print(body.decode("utf-8"), end="")
except Exception as e:
    with open("error.txt", "a", encoding="utf-8") as f:
        f.write(f"{e}\n")
        f.write(f"{traceback.format_exc()}")
        f.write("==================\n")
    exit(1)
