# 💾 Context Preserver (CPS)
A high-availability state synchronization service for unstable networks.

Built with ❤️ by the engineering team at Baya (The Real-time Polling App).

## 🔗 Related Project
This service powers the draft handling for Baya — our open-source real-time polling platform. 👉 [Check out the main Baya App here](https://github.com/donfortune/Baya.git)

## 🛑 The Problem
While building Baya for the African market, we faced a brutal reality: The Network is not reliable.

Users would spend 10 minutes typing a complex poll or a question, only for:
- The network to drop (switching from 4G to 3G).
- The browser tab to crash (low RAM devices).
- The power to cut, killing the router.

When they reloaded, their work was gone. This is unacceptable.

## ⚡ The Solution
Context Preserver is a micro-service designed to "save the game" automatically. It acts as a resilient buffer between the user's volatile browser state and the permanent database.

It doesn't just "save data." It implements Time-Based Conflict Resolution to ensure that when a user switches from their phone (offline) to their laptop (online), we never overwrite new work with old server data.

## 🚀 Features
- **Client-Authority Protocol:** Uses clientTimestamp as the single source of truth to resolve sync conflicts.
- **Device Agnostic:** Start drafting on a phone, resume seamlessly on a laptop.
- **Self-Healing:** Automatically syncs "unsaved" local changes when the network recovers.
- **Ephemeral:** Data auto-expires (TTL) after 24 hours to protect user privacy and save storage.

## 🛠 Tech Stack
- Runtime: Node.js (Express)
- Storage: MongoDB (TTL Indexes & Compound Indexing)
- Architecture: Stateless REST API

## 🔌 Quick Start
This service exposes two core endpoints to handle state:
```bash
# 1. Save a draft (Smart Upsert)
POST /api/v1/drafts
{
  "resourceId": "poll_creation_101",
  "payload": { "question": "..." },
  "clientTimestamp": 1738739200000
}
```
```bash
# 2. Resume a session
GET /api/v1/drafts/poll_creation_101
```
## 🌍 Why we built this
At Baya, we believe software should work for the user, not fight against them. We open-sourced the core logic of our draft system because we believe every African-focused app needs to be "Network-Resilient" by default.

## License
t MIT © Baya Engineering