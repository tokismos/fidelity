// Raw colors for props that need one (icons, indicators). Classes use the same palette from tailwind.config.js
export const colors = {
  ground: "#EEF2F6",
  surface: "#FFFFFF",
  sunk: "#E3E9F0",
  ink: "#10243E",
  ink2: "#56677E",
  ink3: "#8A98AB",
  line: "#D5DDE7",
  line2: "#B8C3D1",
  rose: "#D6336C",
  roseSoft: "#FBE4EC",
  roseInk: "#A8204F",
  sun: "#F5B93A",
  sunSoft: "#FDF0CF",
  danger: "#B3261E",
  dangerLine: "#E9C5C2",
  white: "#FFFFFF",
}

// Soft shadows (React Native boxShadow), only for the few raised things the design allows
export const shadows = {
  // Raised Scan / My code tab button
  roseButton: { boxShadow: "0 10px 18px -10px rgba(214,51,108,0.9)" },
  // "You are here" marker of the path
  roseMarker: { boxShadow: "0 6px 14px -6px rgba(214,51,108,0.8)" },
  // Small marker on the progress rail of a shop card
  roseMarkerSmall: { boxShadow: "0 4px 10px -4px rgba(214,51,108,0.8)" },
  // Undo toast
  toast: { boxShadow: "0 14px 30px -18px rgba(16,36,62,0.45)" },
  // Thin inner ring so light color dots stand out on white
  dotRing: { boxShadow: "inset 0 0 0 1px rgba(16,36,62,0.12)" },
}

// Slice colors of the prize wheel, one per possible slice (8 max). Neighbors alternate dark and light,
// and the last one is a mid tone so it also stands apart from the first.
export const wheelColors = [
  "#10243E", // ink
  "#FDF0CF", // sun soft
  "#D6336C", // rose
  "#E3E9F0", // sunk
  "#F5B93A", // sun
  "#FBE4EC", // rose soft
  "#5E7593", // slate, between ink and sunk
  "#EE9BB8", // mid rose, between rose and rose soft
]
