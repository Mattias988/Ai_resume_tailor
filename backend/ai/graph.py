from ai.state import GraphState
from core.config import settings
from models.resume import Resume
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END

llm = ChatGroq(
    api_key= settings.GROQ_API_KEY,
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    temperature=0,
)

structured_llm = llm.with_structured_output(Resume)

def generate_resume(state: GraphState):
    prompt = f"""
    Przekształć poniższe bazowe CV tak, aby jak najlepiej pasowało do ogłoszenia o pracę.
    Nie zmyślaj faktów. Zwróć dane w wymaganej strukturze.
    
    Bazowe CV:
    {state['base_resume_text']}
    
    Ogłoszenie o pracę:
    {state['job_description_text']}
    """

    response = structured_llm.invoke(prompt)
    return {"final_resume": response}

workflow = StateGraph(GraphState)

workflow.add_node("generate_resume", generate_resume)
workflow.set_entry_point("generate_resume")
workflow.add_edge("generate_resume", END)

app_graph = workflow.compile()