import { Resume } from "../types/resume";

export async function tailorResume(baseText: string, jobDesc: string): Promise<Resume> {
  const response = await fetch("http://localhost:8000/api/tailor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base_resume_text: baseText,
      job_description_text: jobDesc,
    }),
  });

  if (!response.ok) {
    throw new Error("Błąd podczas generowania CV");
  }

  return response.json();
}