import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Shelf UI — File UI Components for React";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Load fonts
const boldFontData = fetch(
  "https://github.com/google/fonts/raw/main/ofl/baijamjuree/BaiJamjuree-Bold.ttf"
).then((res) => res.arrayBuffer());

const mediumFontData = fetch(
  "https://github.com/google/fonts/raw/main/ofl/baijamjuree/BaiJamjuree-Medium.ttf"
).then((res) => res.arrayBuffer());

export default async function Image() {
  const [boldFont, mediumFont] = await Promise.all([
    boldFontData,
    mediumFontData,
  ]);

  return new ImageResponse(
    <div
      style={{
        background: "#07070a", // deep space dark mode background
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Bai Jamjuree"',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: "1000px",
          height: "600px",
          background:
            "radial-gradient(ellipse, rgba(240, 180, 41, 0.15) 0%, transparent 60%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
        }}
      />

      {/* Since Satori doesn't support complex masks, we use a simple linear gradient grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(rgba(238, 237, 245, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(238, 237, 245, 0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Fader for the grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, transparent 0%, #07070a 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 24px",
            borderRadius: "9999px",
            border: "1.5px solid rgba(240, 180, 41, 0.18)",
            background: "rgba(240, 180, 41, 0.06)",
            color: "#f0b429",
            fontSize: "18px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#f0b429",
              boxShadow: "0 0 12px 2px rgba(240, 180, 41, 0.5)",
            }}
          />
          Shadcn Registry · Open Source
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 700,
            color: "#eeedf5",
            margin: "0 0 36px 0",
            textAlign: "center",
            letterSpacing: "-0.045em",
            lineHeight: 1.1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ marginBottom: "12px" }}>Every file UI component</span>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span
              style={{
                color: "#07070a", // solid bg color
                textShadow:
                  "-1.5px -1.5px 0 rgba(240,180,41,0.45), 1.5px -1.5px 0 rgba(240,180,41,0.45), -1.5px 1.5px 0 rgba(240,180,41,0.45), 1.5px 1.5px 0 rgba(240,180,41,0.45)",
              }}
            >
              your app will ever
            </span>
            <span style={{ color: "#f0b429" }}>need.</span>
          </div>
        </div>

        {/* Subtext */}
        <p
          style={{
            fontSize: "30px",
            fontWeight: 500,
            color: "#99999e",
            margin: 0,
            textAlign: "center",
            maxWidth: "860px",
            lineHeight: 1.6,
          }}
        >
          Copy-paste components for the complete file experience — upload,
          preview, manage, navigate. Zero config.
        </p>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Bai Jamjuree",
          data: boldFont,
          style: "normal",
          weight: 700,
        },
        {
          name: "Bai Jamjuree",
          data: mediumFont,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
