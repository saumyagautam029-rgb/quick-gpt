import streamlit as st
from groq import Groq

st.set_page_config(page_title="Quick-GPT", page_icon="🤖", layout="centered")

st.title("🤖 Quick-GPT")
st.caption("Powered by Groq & Llama 3.3")

# Retrieve API key safely from top-level or [general] section
api_key = None
if "GROQ_API_KEY" in st.secrets:
    api_key = st.secrets["GROQ_API_KEY"]
elif "general" in st.secrets and "GROQ_API_KEY" in st.secrets["general"]:
    api_key = st.secrets["general"]["GROQ_API_KEY"]

if not api_key:
    st.error("Please add your GROQ_API_KEY to Streamlit Secrets!")
    st.stop()

# Initialize Groq client
client = Groq(api_key=api_key)

# Initialize session state for messages
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display previous messages
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# User prompt input
if prompt := st.chat_input("Ask me anything..."):
    # Append & display user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Stream response from Groq
    with st.chat_message("assistant"):
        stream = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": m["role"], "content": m["content"]}
                for m in st.session_state.messages
            ],
            stream=True,
        )
        response = st.write_stream(
            chunk.choices[0].delta.content
            for chunk in stream
            if chunk.choices[0].delta.content is not None
        )
    
    st.session_state.messages.append({"role": "assistant", "content": response})
