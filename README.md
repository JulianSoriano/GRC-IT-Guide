# GRC & IT Guide

A searchable reference of terms, notes and interview questions for a **Compliance Officer** role in real estate fintech, with GRC and IT behind it. It covers the compliance officer role, AML and sanctions (PCMLTFA and FINTRAC), Canadian laws and regulators, interview practice, and risk and compliance, controls, privacy law, frameworks, audits, third-party risk, incident response, IT security, Linux basics (including AppImage), AI governance, real estate fintech, and military and defence terms.

## Use it

Open `index.html` in any web browser. There is nothing to install.

- Search from the top bar, or filter by domain in the left list.
- Entries link to related entries.
- Flashcards quiz you on the terms and interview questions in the current view.
- Some entries carry an **Official sources** section linking to the regulator or the law. Links can move, so search the name if one fails.
- A **Zero Breach Toolkit** section explains the separate open-source spyware-check tool (what it checks, how to read a result, its limits, and how to verify it before running). A reduced browser port is in [`scanner/index.html`](scanner/index.html) (see `scanner/NOTICE.md`). The original is not bundled: [interplains/zero-breach-toolkit](https://github.com/interplains/zero-breach-toolkit).
- Treat the legal content as study notes, not legal advice. Entries tagged `check-status` describe fast-moving rules, so confirm them on the regulator's site.
- Add, edit and delete your own entries. They are saved in your browser.
- Use **Export** to download a backup file, and **Import** to load one back, for example on another device.

Clearing your browser's site data erases your changes, so export a backup now and then.

## Put it online with GitHub Pages

In the repository settings, open **Pages**, choose **Deploy from a branch**, pick the main branch and the root folder, and save. The guide will be served at the address GitHub shows.

## Browser Guard
A small Chrome extension that rates your other extensions for spyware-like access, lists the trackers on each site you visit, and checks whether a proxy is redirecting your browsing. Press **Browser Guard** in the top bar to open its entry and download it. The zip is embedded in `index.html`, so the download works offline, and the entry shows its SHA-256. The readable source is in [`browser-guard/`](browser-guard/). To install, unzip it, open `chrome://extensions`, turn on **Developer mode** and choose **Load unpacked**. It only reads; nothing is sent anywhere.

## COBOL Workbench
The whole [COBOL Workbench](https://github.com/JulianSoriano/COBOL-Workbench) (13 lessons, editor and in-browser interpreter) is built into `index.html`. Press **COBOL Workbench** in the top bar, or open `index.html#cobol`. It runs in its own frame, so it does not affect the guide's entries. Its programs are saved separately in the browser.

## AppImage Joiner
The whole [AppImage Joiner](https://github.com/JulianSoriano/AppImage-Joiner) (join split AppImage files, merge PDFs, split PDFs) is built into `index.html`. Press **AppImage Joiner** in the top bar, or open `index.html#aj`. Everything runs in the browser; nothing is uploaded. PDF handling uses pdf-lib 1.17.1 (MIT), embedded in the page (its licence text is included in the file).

## CS50 computer-science sections
Three sections follow Harvard's CS50x week by week (Scratch, C, arrays, algorithms, memory, data structures, Python, SQL, HTML/CSS/JavaScript, Flask, plus the AI and cybersecurity segments): **CS50: Computer science**, **CS50: C & Python** and **CS50: Data, web & AI**. Each entry is tagged `cs50-w0` to `cs50-w9`, and a **CS50 study map** note lists them in order. The entries are original study notes, not course material. Official course: https://cs50.harvard.edu/x/

## Spyware Scanner download
Press **Spyware Scanner** in the top bar for a note with a download button (the browser version of Zero Breach Toolkit, with its SHA-256) and step-by-step instructions. The readable file is also in `scanner/index.html`.

## Linux terminal guide
The Linux basics section now has a full terminal guide (29 entries): start with **Terminal guide: start here**. It covers prompts, paths, files, wildcards, history and shortcuts, quoting, help, pipes and text tools, job control, variables, editors, scripts, safety, using the terminal for audit evidence, a cheat sheet, ten practice tasks and interview questions. Entry text now also shows numbered lists and mixed bullet lists properly.

## CCNA study section

Six sidebar categories (N1 to N6) cover the CCNA 200-301 blueprint: fundamentals and CLI, switching and wireless, IP routing, services and security, automation and AI, and practice questions. Entries are tagged `v1.1` or `v2.0` for the two blueprint versions (v1.1 until 2 Feb 2027, v2.0 from 3 Feb 2027). The **Subnetting Trainer** in the top bar gives random drills with checking. These are study notes, not official Cisco material. Check the current topic list on Cisco's CCNA page before booking.
