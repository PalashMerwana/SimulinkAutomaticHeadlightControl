# Project Summary - Automatic Headlight Control System

## Overview

This project implements an **Automatic Headlight Control System** for an automotive application using **Simulink and Stateflow**. The system is designed to automatically switch vehicle headlights ON or OFF according to surrounding brightness and vehicle operating condition. The project uses a modular model-based design approach, which divides the complete behavior into subsystems for input generation, logic processing, supervisory control, and output verification.

The final output of the system is the signal:

```text
headlamp_cmd
```

where:

- `0` means headlights OFF
- `1` means headlights ON

## Aim

To design and simulate an automatic headlight controller that:

- senses ambient brightness
- detects vehicle movement
- supports driver manual override
- prevents unstable switching using hysteresis
- demonstrates correct behavior under multiple driving scenarios

## Overall Working Principle

The project follows this signal flow:

```text
Input Subsystem -> Logic Subsystem -> Stateflow Controller -> Output Subsystem
```

The **Input Subsystem** generates scenario-based signals such as day, night, tunnel, and stopped-at-night conditions.  
The **Logic Subsystem** converts raw values into stable boolean conditions using threshold checks and hysteresis.  
The **Stateflow Controller** uses those logic signals to choose the correct operating mode.  
The **Output Subsystem** displays, plots, and records the controller output.

## Inputs Used

The controller uses four input signals:

### 1. AmbientLux

This signal represents the surrounding light intensity near the vehicle.

- High lux value -> bright environment
- Low lux value -> dark environment

In the project:

- Day condition = `800 lux`
- Night condition = `100 lux`

### 2. VehicleSpeed

This signal represents whether the vehicle is moving or stopped.

- Speed greater than `0` -> moving
- Speed equal to `0` -> stopped

In the project:

- Moving condition = `60`
- Stopped condition = `0`

### 3. ManualOverride

This input allows the driver to force the headlights ON through a manual switch.

- `0` -> normal automatic operation
- `1` -> override active

When override becomes `1`, the controller enters MANUAL state and forces the lamps ON.

### 4. Fault

This signal is carried through the model as a supervisory input. In the current implementation, it remains `0` during normal simulation, but it is included in the architecture for completeness and future extension.

## Input Subsystem

The Input Subsystem generates four predefined operating scenarios using a Scenario Constant block.

### Scenario 1: Day + Moving

- AmbientLux = `800`
- VehicleSpeed = `60`
- ManualOverride = `0`
- Fault = `0`

Expected output:

```text
headlamp_cmd = 0
```

### Scenario 2: Night + Moving

- AmbientLux = `100`
- VehicleSpeed = `60`
- ManualOverride = `0`
- Fault = `0`

Expected output:

```text
headlamp_cmd = 1
```

### Scenario 3: Tunnel Entry

- Before about `10 s` -> AmbientLux = `800`
- From about `10 s` to `20 s` -> AmbientLux = `100`
- After about `20 s` -> AmbientLux = `800`
- VehicleSpeed = `60`

Expected output:

```text
0 -> 1 -> 0
```

### Scenario 4: Night + Stopped

- AmbientLux = `100`
- VehicleSpeed = `0`
- ManualOverride = `0`
- Fault = `0`

Expected output:

```text
headlamp_cmd = 1
```

This scenario demonstrates the `HOLD` behavior, which keeps the headlights ON even when the vehicle is stopped at night.

## Logic Subsystem

The Logic Subsystem processes raw input values and generates the boolean supervisory signals used by the Stateflow chart.

It creates:

- `lux_status`
- `speed_status`
- `override`
- `fault`

### Lux Threshold Logic

Two threshold comparisons are used:

- `AmbientLux < 300`
- `AmbientLux > 500`

These create a hysteresis band.

#### Why hysteresis is used

If only one threshold were used, small fluctuations in brightness around that value could cause the headlights to switch rapidly ON and OFF. Hysteresis solves this by using separate ON and OFF thresholds:

- below `300 lux` -> treat as dark
- above `500 lux` -> treat as bright
- between `300` and `500 lux` -> keep previous decision

The implemented logic is:

```text
lux_status = (previous_lux_status AND NOT lux_gt_500) OR lux_lt_300
```

### Speed Logic

Vehicle speed is evaluated using:

```text
VehicleSpeed > 0
```

This creates:

- `speed_status = 1` -> moving
- `speed_status = 0` -> stopped

### Override and Fault

Manual override is passed as:

```text
override = ManualOverride
```

Fault is passed as:

```text
fault = Fault
```

## Stateflow Controller

The Stateflow chart is the core decision-making block of the project. It receives:

- `lux_status`
- `speed_status`
- `override`
- `fault`

and produces:

- `headlamp_cmd`

The chart contains four states:

### OFF

Used during bright conditions.  
Output:

```text
headlamp_cmd = 0
```

### ON

Used when the environment is dark and the vehicle is moving.  
Output:

```text
headlamp_cmd = 1
```

### HOLD

Used when the environment is dark and the vehicle is stopped.  
Output:

```text
headlamp_cmd = 1
```

This state is important because the controller should not switch the lights OFF simply because speed becomes zero at night.

### MANUAL

Used when manual override is active.  
Output:

```text
headlamp_cmd = 1
```

This state has the highest priority.

### Transition Logic

The decision sequence of the controller is:

1. If `override = 1`, enter `MANUAL`
2. Else if `lux_status = 0`, enter `OFF`
3. Else if `lux_status = 1` and `speed_status = 1`, enter `ON`
4. Else if `lux_status = 1` and `speed_status = 0`, enter `HOLD`

## Output Subsystem

The Output Subsystem is used to verify the controller behavior.

It includes:

### Headlamp_Display

Displays the current value of `headlamp_cmd`.

### Headlamp_Scope

Plots `headlamp_cmd` against simulation time.

This is especially useful in the tunnel-entry scenario, where the output changes dynamically.

### Headlamp_ToWorkspace

Stores the signal as:

```text
out.headlamp_cmd_ts
```

This is used for logging and result verification.

## Simulation Results

The project was tested under four scenarios:

| Scenario | Condition | Expected Output |
|---|---|---|
| 1 | Day + Moving | `0` |
| 2 | Night + Moving | `1` |
| 3 | Tunnel Entry | `0 -> 1 -> 0` |
| 4 | Night + Stopped | `1` |

The observed results match the expected controller behavior.

## Key Strengths of the Project

- Clear modular subsystem structure
- Stable switching through hysteresis
- State-based supervisory control using Stateflow
- Practical automotive application
- Multiple scenarios for validation
- Demonstrates both control logic and presentation readiness

## Deliverables Included in the Repository

- Main Simulink model: `AutoHeadlightControl.slx`
- Project report: `submission_pack/deliverables/Automatic_Headlight_Control_Report.docx`
- IEEE paper: `submission_pack/deliverables/Automatic_Headlight_Control_IEEE_Paper.docx`
- Presentation: `submission_pack/deliverables/Automatic_Headlight_Control_Presentation.pptx`
- Figures and screenshots: `submission_pack/assets/`

## Conclusion

The Automatic Headlight Control System is a good example of model-based automotive control design. It combines Simulink for subsystem modeling and signal processing with Stateflow for state-based supervisory control. The model successfully demonstrates correct operation under day, night, tunnel-entry, and stopped-at-night scenarios. Hysteresis improves reliability by preventing flickering, while the OFF, ON, HOLD, and MANUAL states make the control strategy clear and easy to explain during evaluation or viva.
