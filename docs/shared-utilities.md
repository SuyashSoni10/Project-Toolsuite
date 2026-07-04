# Shared Utilities Documentation

## Overview

Project Toolsuite includes shared utility scripts that provide common functionality across tools.

---

# theme.js

Theme management and recent tool tracking utility.

## Public Functions

### toggleTheme()

Switches between light and dark mode.

### applyTheme(theme)

Applies a specific theme.

| Parameter | Type | Description |
|------------|------|-------------|
| theme | string | light or dark |

### getSystemTheme()

Returns the user's system theme preference.

### initTheme()

Initializes the theme from localStorage or system settings.

---

## Recent Tools Functions

### saveRecentTool(toolName, toolUrl)

Stores a recently accessed tool.

### renderRecentTools()

Renders recent tool links.

### attachRecentToolsClickHandler()

Tracks tool visits automatically.

---

# notifications.js

Toast notification utility.

## Methods

### notify.show(message, type, duration)

Displays a notification.

### notify.success(message)

Displays a success notification.

### notify.error(message)

Displays an error notification.

### notify.info(message)

Displays an informational notification.

---

## Recommended Script Placement

```html
<script src="../../theme.js"></script>
<script src="../../assets/js/notifications.js"></script>
<script src="./tool.js"></script>
```

---

## Example Usage

### Theme Toggle

```html
<button onclick="toggleTheme()" id="themeBtn">
  DARK MODE
</button>
```

### Notifications

```js
notify.success("Operation completed successfully");

notify.error("Something went wrong");

notify.info("Scan completed");
```