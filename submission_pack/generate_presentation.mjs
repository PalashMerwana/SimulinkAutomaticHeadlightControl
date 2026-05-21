import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PptxGenJS from "file:///C:/Users/Palash/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs/dist/pptxgen.es.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const deliverablesDir = path.join(root, "deliverables");
const assetsDir = path.join(root, "assets");
const outputPath = path.join(deliverablesDir, "Automatic_Headlight_Control_Presentation.pptx");

fs.mkdirSync(deliverablesDir, { recursive: true });

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "[Your Name]";
pptx.company = "[Institute Name]";
pptx.subject = "Automatic Headlight Control";
pptx.title = "Automatic Headlight Control System Using Simulink and Stateflow";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Times New Roman",
  bodyFontFace: "Times New Roman",
  lang: "en-US",
};

const colors = {
  navy: "17324D",
  slate: "425466",
  ink: "1E293B",
  blue: "2B6CB0",
  light: "EAF2F9",
  line: "C7D5E3",
  white: "FFFFFF",
  pale: "F8FBFE",
  accent: "D9EAF7",
  green: "2F855A",
};

function addHeader(slide, title, slideNo) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.6,
    line: { color: colors.navy, transparency: 100 },
    fill: { color: colors.navy },
  });
  slide.addText(title, {
    x: 0.45,
    y: 0.17,
    w: 9.8,
    h: 0.25,
    fontFace: "Times New Roman",
    fontSize: 24,
    bold: true,
    color: colors.white,
  });
  slide.addText(String(slideNo).padStart(2, "0"), {
    x: 12.1,
    y: 0.14,
    w: 0.8,
    h: 0.3,
    fontFace: "Times New Roman",
    fontSize: 18,
    bold: true,
    color: "D7E7F5",
    align: "right",
  });
}

function addFooter(slide) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.45,
    y: 7.05,
    w: 12.3,
    h: 0,
    line: { color: colors.line, pt: 1 },
  });
  slide.addText("Automatic Headlight Control System | Simulink + Stateflow", {
    x: 0.5,
    y: 7.12,
    w: 7.0,
    h: 0.18,
    fontFace: "Times New Roman",
    fontSize: 10,
    color: colors.slate,
  });
}

function addBulletList(slide, items, x, y, w, h, opts = {}) {
  const runs = [];
  items.forEach((item) => {
    runs.push({
      text: item,
      options: {
        bullet: { indent: 16 },
        hanging: 3,
        paraSpaceAfterPt: 7,
      },
    });
  });
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontFace: "Times New Roman",
    fontSize: opts.fontSize || 18,
    color: colors.ink,
    valign: "top",
    margin: 0.05,
    breakLine: true,
  });
}

function addImageOrPlaceholder(slide, filename, x, y, w, h, caption) {
  const filePath = path.join(assetsDir, filename);
  if (fs.existsSync(filePath)) {
    slide.addImage({ path: filePath, x, y, w, h });
  } else {
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.08,
      line: { color: colors.line, pt: 1.5 },
      fill: { color: colors.pale },
    });
    slide.addText("Insert project screenshot here", {
      x: x + 0.2,
      y: y + h / 2 - 0.2,
      w: w - 0.4,
      h: 0.4,
      fontFace: "Times New Roman",
      fontSize: 18,
      bold: true,
      color: colors.slate,
      align: "center",
      valign: "mid",
    });
  }
  slide.addText(caption, {
    x,
    y: y + h + 0.04,
    w,
    h: 0.2,
    fontFace: "Times New Roman",
    fontSize: 11,
    italic: true,
    color: colors.slate,
    align: "center",
  });
}

function addInfoBox(slide, x, y, w, h, title, body) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    line: { color: colors.line, pt: 1.2 },
    fill: { color: colors.white },
  });
  slide.addText(title, {
    x: x + 0.15,
    y: y + 0.1,
    w: w - 0.3,
    h: 0.25,
    fontFace: "Times New Roman",
    fontSize: 18,
    bold: true,
    color: colors.blue,
  });
  slide.addText(body, {
    x: x + 0.15,
    y: y + 0.42,
    w: w - 0.3,
    h: h - 0.5,
    fontFace: "Times New Roman",
    fontSize: 15,
    color: colors.ink,
    margin: 0.03,
    valign: "top",
  });
}

function addScenarioTable(slide) {
  slide.addTable(
    [
      [
        { text: "Scenario", options: { bold: true, color: colors.ink } },
        { text: "Condition", options: { bold: true, color: colors.ink } },
        { text: "Expected Output", options: { bold: true, color: colors.ink } },
      ],
      ["1", "Day + Moving", "0"],
      ["2", "Night + Moving", "1"],
      ["3", "Tunnel Entry", "0 -> 1 -> 0"],
      ["4", "Night + Stopped", "1"],
    ],
    {
      x: 0.6,
      y: 4.1,
      w: 5.8,
      h: 1.9,
      border: { pt: 1, color: colors.line },
      fill: colors.white,
      color: colors.ink,
      fontFace: "Times New Roman",
      fontSize: 15,
      margin: 0.06,
      rowH: 0.38,
      colW: [1.0, 2.8, 2.0],
      valign: "mid",
      align: "center",
      autoFit: false,
    }
  );
}

// Slide 1
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.pale };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    line: { color: colors.pale, transparency: 100 },
    fill: { color: colors.pale },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 1.2,
    line: { color: colors.navy, transparency: 100 },
    fill: { color: colors.navy },
  });
  slide.addText("Automatic Headlight Control System", {
    x: 0.7,
    y: 1.45,
    w: 6.5,
    h: 0.9,
    fontFace: "Times New Roman",
    fontSize: 24,
    bold: true,
    color: colors.navy,
  });
  slide.addText("Model-Based Design using Simulink & Stateflow", {
    x: 0.72,
    y: 2.42,
    w: 5.7,
    h: 0.35,
    fontFace: "Times New Roman",
    fontSize: 18,
    color: colors.slate,
  });
  slide.addText("Submitted by: [Your Name]\nPRN: [Your PRN]\nDepartment: Electronics and Telecommunication Engineering", {
    x: 0.75,
    y: 3.15,
    w: 5.4,
    h: 1.25,
    fontFace: "Times New Roman",
    fontSize: 18,
    color: colors.ink,
    breakLine: true,
    margin: 0,
  });
  addImageOrPlaceholder(slide, "figure_top_level.png", 7.0, 1.35, 5.4, 3.6, "Top-Level Simulink Architecture");
  addInfoBox(
    slide,
    7.0,
    5.35,
    5.4,
    1.05,
    "Core Flow",
    "Input Subsystem -> Logic Subsystem -> Stateflow Controller -> Output Subsystem"
  );
  addFooter(slide);
}

// Slide 2
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.white };
  addHeader(slide, "Introduction and Problem Statement", 1);
  addBulletList(
    slide,
    [
      "Automatic headlight control improves safety by switching headlights according to environmental brightness.",
      "The controller must react correctly during day driving, night driving, tunnel entry, and stopped-at-night conditions.",
      "The system also includes manual override and a fault input for supervisory behavior.",
      "The final output is headlamp_cmd where 0 = OFF and 1 = ON.",
    ],
    0.7,
    1.1,
    6.1,
    2.6
  );
  addInfoBox(slide, 0.75, 4.1, 2.5, 1.15, "Objective", "Build and simulate a modular automotive headlight controller.");
  addInfoBox(slide, 3.45, 4.1, 2.5, 1.15, "Novelty Feature", "Manual override takes priority over automatic behavior.");
  addInfoBox(slide, 6.15, 4.1, 2.5, 1.15, "Simulation Type", "Discrete-time model, fixed step 0.1 s, stop time 40 s.");
  addImageOrPlaceholder(slide, "figure_scope_scenario3.png", 9.0, 1.25, 3.6, 4.8, "Tunnel-entry simulation placeholder");
  addFooter(slide);
}

// Slide 3
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.white };
  addHeader(slide, "System Architecture", 2);
  addImageOrPlaceholder(slide, "figure_top_level.png", 0.65, 1.05, 7.15, 4.8, "Overall Simulink model");
  addBulletList(
    slide,
    [
      "Input Subsystem generates AmbientLux, VehicleSpeed, ManualOverride, and Fault.",
      "Logic Subsystem converts raw values into lux_status and speed_status using hysteresis.",
      "Stateflow Controller applies OFF, ON, HOLD, and MANUAL states.",
      "Output Subsystem displays, plots, and logs headlamp_cmd.",
    ],
    8.15,
    1.25,
    4.5,
    3.4,
    { fontSize: 17 }
  );
  addInfoBox(slide, 8.2, 5.0, 4.3, 0.95, "Key Flow", "Signal conditioning is separated from final state-based decision making.");
  addFooter(slide);
}

// Slide 4
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.white };
  addHeader(slide, "Input and Logic Subsystems", 3);
  addImageOrPlaceholder(slide, "figure_input_subsystem.png", 0.7, 1.1, 5.9, 2.45, "Input Subsystem");
  addImageOrPlaceholder(slide, "figure_logic_subsystem.png", 0.7, 4.0, 5.9, 2.45, "Logic Subsystem");
  addBulletList(
    slide,
    [
      "Scenario 1: Day + Moving -> AmbientLux = 800, VehicleSpeed = 60",
      "Scenario 2: Night + Moving -> AmbientLux = 100, VehicleSpeed = 60",
      "Scenario 3: Tunnel Entry -> 800 -> 100 -> 800 lux with vehicle moving",
      "Scenario 4: Night + Stopped -> AmbientLux = 100, VehicleSpeed = 0",
      "Logic uses AmbientLux < 300 and AmbientLux > 500 to implement hysteresis.",
      "Unit Delay + NOT + AND + OR create lux_status memory and prevent flicker.",
    ],
    6.95,
    1.12,
    5.7,
    5.65,
    { fontSize: 15.5 }
  );
  addFooter(slide);
}

// Slide 5
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.white };
  addHeader(slide, "Stateflow Controller", 4);
  addImageOrPlaceholder(slide, "figure_stateflow.png", 0.75, 1.15, 5.5, 4.1, "Stateflow Controller");
  addInfoBox(slide, 6.55, 1.18, 2.75, 1.1, "OFF", "Active in bright conditions. Output: headlamp_cmd = 0");
  addInfoBox(slide, 9.6, 1.18, 2.75, 1.1, "ON", "Active when dark and moving. Output: headlamp_cmd = 1");
  addInfoBox(slide, 6.55, 2.55, 2.75, 1.15, "HOLD", "Dark and stopped. Lamps remain ON for safety.");
  addInfoBox(slide, 9.6, 2.55, 2.75, 1.15, "MANUAL", "Override active. Highest-priority state, lamps forced ON.");
  addBulletList(
    slide,
    [
      "If override = 1 -> MANUAL",
      "Else if lux_status = 0 -> OFF",
      "Else if lux_status = 1 and speed_status = 1 -> ON",
      "Else if lux_status = 1 and speed_status = 0 -> HOLD",
    ],
    6.55,
    4.15,
    5.7,
    2.0,
    { fontSize: 16 }
  );
  addFooter(slide);
}

// Slide 6
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.white };
  addHeader(slide, "Output Subsystem and Simulation Scenarios", 5);
  addImageOrPlaceholder(slide, "figure_output_subsystem.png", 0.65, 1.1, 5.6, 2.95, "Output Subsystem");
  addScenarioTable(slide);
  addBulletList(
    slide,
    [
      "Headlamp_Display shows the current logical value of headlamp_cmd.",
      "Headlamp_Scope plots output over time, especially useful for tunnel entry.",
      "Headlamp_ToWorkspace logs out.headlamp_cmd_ts for verification.",
    ],
    6.8,
    1.25,
    5.7,
    1.9,
    { fontSize: 16 }
  );
  addFooter(slide);
}

// Slide 7
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.white };
  addHeader(slide, "Simulation Results", 6);
  addImageOrPlaceholder(slide, "figure_scope_scenario1.png", 0.65, 1.1, 3.0, 2.0, "Scenario 1 Output");
  addImageOrPlaceholder(slide, "figure_scope_scenario2.png", 3.95, 1.1, 3.0, 2.0, "Scenario 2 Output");
  addImageOrPlaceholder(slide, "figure_scope_scenario3.png", 7.25, 1.1, 3.0, 2.0, "Scenario 3 Output");
  addImageOrPlaceholder(slide, "figure_scope_scenario4.png", 10.55, 1.1, 2.1, 2.0, "Scenario 4 Output");
  addInfoBox(slide, 0.75, 3.6, 3.0, 1.15, "Scenario 1", "Day + Moving -> output remains 0 because brightness is high.");
  addInfoBox(slide, 4.05, 3.6, 3.0, 1.15, "Scenario 2", "Night + Moving -> output remains 1 because the environment is dark.");
  addInfoBox(slide, 7.35, 3.6, 3.0, 1.15, "Scenario 3", "Tunnel Entry -> output changes 0 -> 1 -> 0 as lux drops and recovers.");
  addInfoBox(slide, 10.55, 3.6, 2.1, 1.15, "Scenario 4", "Night + Stopped -> HOLD state keeps output at 1.");
  addInfoBox(slide, 0.75, 5.25, 11.85, 1.0, "Observation", "The results confirm correct hysteresis-based signal conditioning and correct state transitions across all four scenarios.");
  addFooter(slide);
}

// Slide 8
{
  const slide = pptx.addSlide();
  slide.background = { color: colors.pale };
  addHeader(slide, "Conclusion", 7);
  addBulletList(
    slide,
    [
      "The model uses a clean modular structure: Input -> Logic -> Stateflow -> Output.",
      "Hysteresis with 300 lux and 500 lux thresholds prevents rapid switching near the decision boundary.",
      "Stateflow clearly represents OFF, ON, HOLD, and MANUAL operating modes.",
      "The model is validated for day, night, tunnel, and stopped-at-night conditions.",
      "Manual override provides direct driver priority over automatic behavior.",
    ],
    0.9,
    1.25,
    7.0,
    3.8,
    { fontSize: 18 }
  );
  addInfoBox(slide, 8.35, 1.4, 4.0, 1.15, "Final Line for Viva", "This model senses, decides, controls, and verifies automatic headlight behavior using Simulink and Stateflow.");
  addInfoBox(slide, 8.35, 3.0, 4.0, 1.0, "Replace Before Submission", "Swap placeholders with final Simulink screenshots and scope captures.");
  addInfoBox(slide, 8.35, 4.45, 4.0, 1.0, "Submitted By", "[Your Name] | [Your PRN]");
  addFooter(slide);
}

await pptx.writeFile({ fileName: outputPath });
console.log(outputPath);
