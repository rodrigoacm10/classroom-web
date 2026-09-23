import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** The Locus mark, same geometry as the wordmark badge in `components/ui/logo.tsx`. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#ffc400",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: "#18191b",
          }}
        />
      </div>
    ),
    size,
  );
}
