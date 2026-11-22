#!/usr/bin/env python3
"""Confirm YouTube videos exist and print their real title and channel (via YouTube's public oEmbed endpoint).

  yt_verify.py VIDEO_ID_OR_URL ...
Exit code 1 if any video can't be verified. Only list videos that print OK.
"""
import json, re, sys, urllib.request, urllib.parse

def vid(s):
    m = re.search(r'(?:v=|youtu\.be/|shorts/|embed/)([\w-]{11})', s)
    return m.group(1) if m else s.strip()

bad = 0
for arg in sys.argv[1:]:
    i = vid(arg)
    url = 'https://www.youtube.com/oembed?format=json&url=' + urllib.parse.quote(f'https://www.youtube.com/watch?v={i}')
    try:
        d = json.load(urllib.request.urlopen(url, timeout=10))
        print(f"OK   {i} | {d['title']} | {d['author_name']}")
    except Exception as e:
        bad += 1; print(f'FAIL {i} | {e}')
sys.exit(1 if bad else 0)
