# Month Navigation Components

This directory contains reusable components for month navigation functionality.

## Components

### MonthNavigation Component

A reusable month navigation component with left/right arrows and optional filter button.

#### Props

```typescript
interface MonthNavigationProps {
  currentMonth: string;                    // Current month to display (e.g., "December")
  onMonthChange: (direction: "prev" | "next") => void;  // Callback for month changes
  showFilter?: boolean;                    // Whether to show filter button (default: true)
  onFilterClick?: () => void;             // Callback for filter button click
  className?: string;                      // Additional CSS classes
}
```

#### Usage

```tsx
import MonthNavigation from "../Common/MonthNavigation";

const MyComponent = () => {
  const [currentMonth, setCurrentMonth] = useState("December");
  
  const handleMonthChange = (direction: "prev" | "next") => {
    // Your month change logic here
    console.log(`Navigate to ${direction} month`);
  };

  return (
    <MonthNavigation
      currentMonth={currentMonth}
      onMonthChange={handleMonthChange}
      showFilter={true}
      onFilterClick={() => console.log("Filter clicked")}
    />
  );
};
```

## Hooks

### useMonthNavigation Hook

A custom hook that provides month navigation logic.

#### Returns

```typescript
{
  currentMonth: string;                    // Current month
  handleMonthChange: (direction: "prev" | "next") => void;  // Month change handler
  goToCurrentMonth: () => void;           // Jump to current month
  goToSpecificMonth: (month: string) => void;  // Jump to specific month
  setCurrentMonth: (month: string) => void;    // Direct month setter
}
```

#### Usage

```tsx
import { useMonthNavigation } from "../../hooks/useMonthNavigation";

const MyComponent = () => {
  const { 
    currentMonth, 
    handleMonthChange, 
    goToCurrentMonth 
  } = useMonthNavigation();

  return (
    <div>
      <p>Current month: {currentMonth}</p>
      <MonthNavigation
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
      />
      <button onClick={goToCurrentMonth}>Go to Today</button>
    </div>
  );
};
```

## Examples

### Basic Usage

```tsx
import MonthNavigation from "../Common/MonthNavigation";
import { useMonthNavigation } from "../../hooks/useMonthNavigation";

const CalendarPage = () => {
  const { currentMonth, handleMonthChange } = useMonthNavigation();

  return (
    <div>
      <h1>Calendar</h1>
      <MonthNavigation
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        showFilter={true}
        onFilterClick={() => console.log("Filter clicked")}
      />
      {/* Your calendar content here */}
    </div>
  );
};
```

### Advanced Usage with Custom Logic

```tsx
import MonthNavigation from "../Common/MonthNavigation";
import { useMonthNavigation } from "../../hooks/useMonthNavigation";

const AdvancedCalendar = () => {
  const { 
    currentMonth, 
    handleMonthChange, 
    goToCurrentMonth,
    goToSpecificMonth 
  } = useMonthNavigation();

  const handleFilterClick = () => {
    // Your filter logic
    console.log("Opening filter modal");
  };

  const handleCustomMonthChange = (direction: "prev" | "next") => {
    handleMonthChange(direction);
    // Additional logic after month change
    console.log(`Month changed to ${currentMonth}`);
  };

  return (
    <div>
      <div className="calendar-header">
        <MonthNavigation
          currentMonth={currentMonth}
          onMonthChange={handleCustomMonthChange}
          showFilter={true}
          onFilterClick={handleFilterClick}
          className="custom-month-nav"
        />
      </div>
      
      <div className="calendar-actions">
        <button onClick={goToCurrentMonth}>Today</button>
        <button onClick={() => goToSpecificMonth("January")}>Go to January</button>
      </div>
    </div>
  );
};
```

## Styling

The component uses Tailwind CSS classes. You can customize the appearance by:

1. **Passing custom className:**
```tsx
<MonthNavigation
  className="my-custom-styles"
  // ... other props
/>
```

2. **Overriding with CSS:**
```css
.custom-month-nav .ant-btn {
  background-color: #your-color;
  border-color: #your-color;
}
```

## Integration

To use these components in your existing files:

1. **Import the components:**
```tsx
import MonthNavigation from "../Common/MonthNavigation";
import { useMonthNavigation } from "../../hooks/useMonthNavigation";
```

2. **Replace existing month navigation code:**
```tsx
// Old way
const [currentMonth, setCurrentMonth] = useState("December");
const handleMonthChange = (direction) => { /* logic */ };

// New way
const { currentMonth, handleMonthChange } = useMonthNavigation();
```

3. **Use the component:**
```tsx
<MonthNavigation
  currentMonth={currentMonth}
  onMonthChange={handleMonthChange}
  showFilter={true}
  onFilterClick={handleFilterClick}
/>
```

This approach makes your month navigation consistent across all components and easier to maintain.
