"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";

interface FormDataState {
    name: string;
    email: string;
    phone: string;
    coverLetter: string;
    resume: File | null;
}

export default function CareerForm() {
    const [formData, setFormData] = useState<FormDataState>({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
    });

    const [status, setStatus] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === "resume" && files) {
            setFormData((prev) => ({ ...prev, resume: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("Submitting...");

        const body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                body.append(key, value as any);
            }
        });

        try {
            const res = await fetch("/api/submit-career", {
                method: "POST",
                body: body,
            });

            if (res.ok) {
                setStatus("✅ Application submitted successfully!");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    coverLetter: "",
                    resume: null,
                });
                if (fileInputRef.current) fileInputRef.current.value = "";
            } else {
                setStatus("❌ Failed to submit application.");
            }
        } catch (error) {
            console.error(error);
            setStatus("❌ An error occurred.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Career Application
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    encType="multipart/form-data"
                >
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Cover Letter"
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded"
                    />

                    {/* Resume Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resume
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            required
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded hover:bg-blue-200 transition"
                            >
                                Upload Resume
                            </button>
                            <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                {formData.resume ? formData.resume.name : "No file selected"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                        Submit Application
                    </button>

                    {status && (
                        <p className="text-center text-sm text-gray-600 mt-2">{status}</p>
                    )}
                </form>
            </div>
        </div>
    );
}
