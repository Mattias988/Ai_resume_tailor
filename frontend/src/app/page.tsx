"use client";

import { useState } from "react";
import { tailorResume } from "@/lib/api";
import { Resume } from "@/app/types/resume";

export default function Home() {
  const [baseResumeText, setBaseResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tailorResume(baseResumeText, jobDescriptionText);
      setResumeData(data);
    } catch (err) {
      setError("Wystąpił błąd podczas generowania CV.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row print:bg-white">
      <div className="w-full lg:w-1/3 p-6 bg-white shadow-md flex flex-col gap-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">AI Resume Tailor</h1>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Twoje bazowe CV</label>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={baseResumeText}
            onChange={(e) => setBaseResumeText(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Ogłoszenie o pracę</label>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !baseResumeText || !jobDescriptionText}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Generowanie..." : "Dopasuj CV"}
        </button>

        {error && <p className="text-red-600 font-semibold">{error}</p>}
        
        {resumeData && (
          <button
            onClick={handlePrint}
            className="w-full py-3 mt-4 bg-green-600 text-white font-bold rounded hover:bg-green-700"
          >
            Drukuj do PDF
          </button>
        )}
      </div>

      <div className="w-full lg:w-2/3 p-8 flex justify-center overflow-auto print:p-0 print:overflow-visible">
        {resumeData ? (
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-12 text-gray-900 print:shadow-none print:m-0 print:p-0">
            <header className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-4xl font-bold uppercase tracking-wider">
                {resumeData.name || resumeData.full_name}
              </h1>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.phone && <span>• {resumeData.phone}</span>}
              </div>
            </header>

            {resumeData.summary && (
              <section className="mb-6">
                <h2 className="text-xl font-bold border-b border-gray-300 mb-2 uppercase text-gray-800">
                  Podsumowanie
                </h2>
                <p className="text-sm leading-relaxed">{resumeData.summary}</p>
              </section>
            )}

            {(resumeData.experience || resumeData.experiences) && (
              <section className="mb-6">
                <h2 className="text-xl font-bold border-b border-gray-300 mb-2 uppercase text-gray-800">
                  Doświadczenie zawodowe
                </h2>
                <div className="flex flex-col gap-4">
                  {(resumeData.experience || resumeData.experiences || []).map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>{exp.position}</span>
                        <span>
                          {exp.start_date} - {exp.end_date || "Obecnie"}
                        </span>
                      </div>
                      <div className="text-gray-600 font-semibold text-sm mb-1">
                        {exp.company}
                      </div>
                      <div className="text-sm">
                        {Array.isArray(exp.description) ? (
                          <ul className="list-disc pl-5">
                            {exp.description.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {resumeData.education && resumeData.education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold border-b border-gray-300 mb-2 uppercase text-gray-800">
                  Edukacja
                </h2>
                <div className="flex flex-col gap-3">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-gray-800 text-sm">
                        <span>{edu.degree} {edu.field_of_study ? `- ${edu.field_of_study}` : ""}</span>
                        <span>
                          {edu.start_date} - {edu.end_date || "Obecnie"}
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {edu.institution}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {resumeData.certificates && resumeData.certificates.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-xl font-bold border-b border-gray-300 mb-2 uppercase text-gray-800">
                    Certyfikaty
                  </h2>
                  <div className="flex flex-col gap-3">
                    {resumeData.certificates.map((cert, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between font-bold text-gray-800 text-md">
                            <span>{cert.title}</span>
                          </div>
                          <div className="text-gray-900 text-sm">
                            {cert.institution}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {cert.date_of_receive}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {cert?.id}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {cert?.link}
                          </div>
                        </div>
                    ))}
                  </div>
                </section>
            )}

            {resumeData.skills && resumeData.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold border-b border-gray-300 mb-2 uppercase text-gray-800">
                  Umiejętności
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resumeData.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 font-semibold print:hidden">
            Wypełnij formularz i wygeneruj CV aby zobaczyć podgląd.
          </div>
        )}
      </div>
    </div>
  );
}