# **MedForce AI: Chat Agent API**

## **Endpoint**

```
POST https://api.medforce-ai.com/send-chat
```

## **Description**

This endpoint sends a conversational query to the MedForce Clinical Agent.
The agent can answer questions, navigate the clinical canvas, extract data, or generate tasks depending on the conversation context.

The request **must include chat history**, not just a single message.
The **last item in the list is treated as the new user query**.

---

## **Request Body Format**

The request must be a **JSON array** of message objects:

```json
[
  {
    "role": "user" | "assistant",
    "content": "string"
  }
]
```

| Field     | Type   | Description           |
| --------- | ------ | --------------------- |
| `role`    | string | `user` or `assistant` |
| `content` | string | The message text      |

---

## **Example 1 — Initial Question**

```python
import requests

url = "https://api.medforce-ai.com/send-chat"

payload = [
    {"role": "user", "content": "Create task to pull Sarah Miller Radiology data."}
]

response = requests.post(url, json=payload)

print("Status:", response.status_code)
print("Response:", response.text)
```

### **Behavior**

* This triggers the **Task Workflow Agent**
* The workflow runs **in background**
* The response will be:

```
"Task generated. Agent will execute in background."
```

---

## **Example 2 — Continuing the Conversation**

After the workflow is created, you can ask **follow-up questions**.

> The important part: **Include previous exchanges** in the array.

```python
import requests

url = "https://api.medforce-ai.com/send-chat"

payload = [
    {"role": "user", "content": "Create task to pull Sarah Miller Radiology data."},
    {"role": "assistant", "content": "Task generated. Agent will execute in background."},
    {"role": "user", "content": "Tell me summary of Sarah Miller"}
]

response = requests.post(url, json=payload)

print("Status:", response.status_code)
print("Response:", response.text)
```

### **Behavior**

* The agent uses your **previous messages as context**
* Fetches data from the clinical board
* Returns **structured summary reasoning**

---

## **Example 3 — General Clinical Q&A**

```python
payload = [
    {"role": "user", "content": "What are the key lab abnormalities in this patient?"}
]
```

---

## **Error Handling**

| Condition            | Cause                   | Solution                                          |
| -------------------- | ----------------------- | ------------------------------------------------- |
| `400 Bad Request`    | Malformed JSON          | Ensure payload is a JSON **array**, not an object |
| `500 Internal Error` | Model timeout / network | Retry request after 2–4 seconds                   |
| No change in canvas  | Task not finished yet   | Wait or request task status                       |

---

## **Notes**

* The system **remembers context only within the provided payload**, not globally.
* If you want persistent chat, **your frontend must store history** and send it each call.
* Background workflows **continue even if the client disconnects**.

---

