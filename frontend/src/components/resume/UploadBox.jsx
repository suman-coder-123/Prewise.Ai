import { useRef } from "react";
import { UploadCloud } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

const UploadBox = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    onFileSelect(file);
  };

  return (
    <Card className="p-10">

      <div className="flex flex-col items-center text-center">

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">

          <UploadCloud
            size={42}
            className="text-indigo-600"
          />

        </div>

        <h2 className="mt-8 text-3xl font-bold">
          Upload Your Resume
        </h2>

        <p className="mt-4 max-w-xl leading-8 text-slate-500">
          Upload your resume in PDF format.
          Our AI will analyze your ATS score,
          detect missing skills,
          and prepare you for interviews.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          className="mt-8"
          onClick={() => fileInputRef.current.click()}
        >
          Choose Resume
        </Button>

        <p className="mt-5 text-sm text-slate-400">
          PDF only • Max 5 MB
        </p>

      </div>

    </Card>
  );
};

export default UploadBox;