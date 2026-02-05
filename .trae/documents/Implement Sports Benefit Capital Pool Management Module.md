I will implement the **"Sports Benefit Capital Pool Management"** (体育惠民资金池管理) system as a new, independent module, following the structure of the existing Admin and Mobile modules.

### Implementation Plan

1.  **Project Structure Setup**
    *   Create a new directory `src/fund-admin` for the new module.
    *   Initialize core files: `main.js`, `App.vue`, `router.js`, and `index.html` specific to this module.
    *   Update `vite.config.js` to register the new entry point (`src/fund-admin/index.html`).

2.  **Frontend Views Development (Based on Manual)**
    *   **Layout**: Create a sidebar navigation layout matching the manual's menu structure (Home, Venue, Company, Capital Pool, Reconciliation, etc.).
    *   **Dashboard (`Dashboard.vue`)**: Implement the overview page with 2026 total funds, channel breakdowns (Suzhou Dao, Citizen Card, Ningbo Bank), and warning lists using mock data.
    *   **Theme Capital Pool Management (`FundPoolMgr.vue`)**:
        *   Yearly management and channel pool list.
        *   Functionality for "Inject" (注入), "Reduce" (减额), and "Warning Settings" (预警设置) using Element Plus dialogs.
    *   **Other Management Views**:
        *   `CompanyMgr.vue`: Company list with status toggles.
        *   `ReconciliationMgr.vue`: Order reconciliation list with query filters.
        *   `CustomerMgr.vue` & `UserMgr.vue`: Basic list management views.
        *   `WarningMgr.vue`: Warning history logs.
        *   `DictMgr.vue`: Dictionary management (e.g., Area settings).

3.  **Entry Point Integration**
    *   Modify the main landing page `src/index.html` to include a **3rd Entry Card** for "Sports Benefit Capital Pool Management".
    *   Update the CSS layout to accommodate three columns.

4.  **Mock Data & Logic**
    *   Since a backend is not required, I will use local reactive state (Vue `ref`/`reactive`) and Pinia store to simulate database operations (CRUD, Fund Injection, etc.) so the UI is fully interactive for demonstration.

### Verification
*   I will verify that the new entry point appears on the main page.
*   I will verify that clicking the new entry opens the Capital Pool Management system.
*   I will verify that key features like "Fund Injection" update the displayed numbers in the dashboard.