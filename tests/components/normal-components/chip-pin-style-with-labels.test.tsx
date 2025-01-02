import { test, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-fixture"
import React from "react"
import "lib/register-catalogue"
import "lib/fiber/intrinsic-jsx"

test("Chip should support pin labels in schPinStyle", () => {
  const { circuit } = getTestFixture()

  const pinLabels = {
    pin1: ["GND", "A1"],
    pin2: ["VCC", "B12"],
    pin3: ["SIG", "A4"],
  }

  circuit.add(
    <board width="10mm" height="10mm">
      <chip
        name="U1"
        pinLabels={pinLabels}
        schPinStyle={{
          // Should work with pin numbers
          pin1: { topMargin: 0.4 },
          // Should work with primary pin labels
          GND: { bottomMargin: 0.3 },
          // Should work with alternate pin labels
          A4: { leftMargin: 0.2 },
        }}
        schPortArrangement={{
          leftSide: {
            pins: ["GND", "VCC", "SIG"],
            direction: "top-to-bottom",
          },
        }}
        manufacturerPartNumber="TEST-CHIP"
      />
    </board>,
  )

  circuit.render()

  // The schematic component should be created with the correct pin styles
  const schComponent = circuit.db.schematic_component.list()[0]
  expect(schComponent.pin_styles).toBeDefined()
  expect(schComponent.pin_styles?.pin1?.top_margin).toBe(0.4)
  expect(schComponent.pin_styles?.pin1?.bottom_margin).toBe(0.3)
  expect(schComponent.pin_styles?.pin3?.left_margin).toBe(0.2)

  expect(circuit).toMatchSchematicSnapshot(import.meta.path)
})
