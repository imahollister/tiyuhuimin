# Implementation Plan: Mobile Detail View Refactoring

## 1. Structure Refactoring with Tabs
*   **Introduce `van-tabs`**:
    *   Replace the current linear layout of "Intro" and "Booking/Items" with a tabbed interface.
    *   **Tab 1: "预订服务" (Booking/Services)**:
        *   Contains the Booking Grid (for venues with fields/slots).
        *   Contains the Item List (for tickets and services).
        *   This should be the default active tab.
    *   **Tab 2: "场馆介绍" (Introduction)**:
        *   Contains the venue introduction text (`venue.intro`).
        *   (Optional) Move basic info (address, hours, etc.) here or keep it in the header.

## 2. Service Item Visibility Check
*   **Verify Item Rendering**:
    *   The user mentioned "didn't see service content".
    *   I will double-check the `v-if` conditions.
    *   Currently: `v-if="venue.items && venue.items.length"` inside `v-else` of `booking-grid`.
    *   **Issue**: If a venue has *both* booking slots AND service items, the `v-else` block might be hidden if I only check for slots first.
    *   **Fix**: Ensure *both* the booking grid AND the item list can be displayed if they exist, rather than using `v-if/v-else` mutually exclusive logic.
    *   The "Services/Tickets" list should be displayed *below* the booking grid if both exist, or standalone if no booking grid.

## 3. UI/UX Refinement
*   **Sticky Tabs**: Use `van-tabs` with `sticky` prop to keep navigation accessible.
*   **Empty States**: Ensure clear empty states for each tab if no content is available.

## 4. Verification
*   **Test Case 1**: Venue with only Booking Slots -> Booking Grid shows in Tab 1.
*   **Test Case 2**: Venue with only Services/Tickets -> Item List shows in Tab 1.
*   **Test Case 3**: Venue with BOTH -> Both show in Tab 1 (stacked).
*   **Test Case 4**: Tab Switching -> Switch to "Introduction" tab shows text.
