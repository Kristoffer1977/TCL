import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function TransportChallengeTool() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Transport Challenge Tool</h1>
      <p className="mb-4 text-lg text-center text-gray-700">
        Describe your logistics or transport challenge below:
      </p>
      <div className="flex gap-2 w-full max-w-xl mb-6">
        <Input
          type="text"
          placeholder="e.g., How to optimize last-mile delivery?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </Button>
      </div>

      {videoUrl && (
        <Card className="w-full max-w-2xl">
          <CardContent className="p-4">
            <video controls autoPlay className="rounded w-full">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
