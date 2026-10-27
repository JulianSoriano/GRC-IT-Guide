# Notice

`index.html` is a browser port of ideas and matching rules from **Zero Breach Toolkit** by archivegenocide (https://github.com/interplains/zero-breach-toolkit), licensed under the Apache License 2.0 (see `LICENSE` in this folder).

## Changes made
Independently reimplemented in JavaScript (not a copy of the Python code): indicator parsing and matching, a read-only SQLite reader, iOS backup and Android backup readers (including password-based decryption using WebCrypto), evidence grading, verdicts and reports. Added a browser user interface. Omitted: YARA rules, Windows registry/Prefetch/Amcache/event-log parsing, and other iOS data. Only the small CC0 indicator sets are embedded.

## Data
- Embedded `adfection_iocs.txt` and `curated_mercenary.txt`: CC0 1.0, from the original project's `iocs/`.
- Larger lists (Amnesty International, MVT, Citizen Lab, ECHAP) are downloaded by the user at run time from their publishers, kept in the browser, and not redistributed here. Their own licences apply.
- The Candiru YARA rules (separate licences) are not included.

## Status
This port is unverified and tested only on synthetic data. It is not affiliated with or endorsed by the original authors or by any indicator publisher.
