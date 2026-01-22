# React Hook Form Wizard with Zod Validation

A multi-step form wizard built with React, React Hook Form, Zod validation, and Tailwind CSS. This project demonstrates advanced form handling with step-by-step validation, conditional navigation, and async operations.

## 🎯 Features

- **Multi-step Form Wizard**: 5 steps with smooth navigation
- **Form Validation**: Zod schema validation with React Hook Form
- **Conditional Logic**: Steps can be skipped based on user input
- **Cross-step Validation**: Validate fields based on previous step data
- **Async Operations**: Simulated async operations between steps
- **Animated Progress Bar**: Visual feedback with toggleable animations
- **Beautiful UI**: Modern dark theme with Tailwind CSS
- **Responsive Design**: Works on all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
cd /Users/F8/Daily-F8-React/BT2/form-zod
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## 📦 Dependencies

- **React**: ^19.2.0
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod
- **Tailwind CSS**: Styling framework
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind

## 🎨 Project Structure

```
src/
├── components/
│   ├── WizardForm.jsx          # Main wizard container
│   └── steps/
│       ├── ContactInfoStep.jsx  # Step 1: Contact information
│       ├── UsernameStep.jsx     # Step 2: Username selection
│       ├── WarningStep.jsx      # Step 3: Email warning (conditional)
│       ├── AsyncStep.jsx        # Step 4: Async operation
│       └── CompletionStep.jsx   # Step 5: Completion summary
├── schemas/
│   └── wizardSchema.js         # Zod validation schemas
├── App.jsx                     # Root component
└── index.css                   # Global styles with Tailwind
```

## 📝 Form Steps

### Step 1: Contact Info

- **Fields**: First Name, Last Name, Age, Email (optional)
- **Validation**:
  - First Name: Required
  - Last Name: Required
  - Age: Required, must be between 18-120
  - Email: Valid email format or empty

### Step 2: Username

- **Fields**: Username
- **Validation**:
  - Username: Required
  - Must include the first name from Step 1

### Step 3: Warning (Conditional)

- **Condition**: Only shown if email was NOT provided in Step 1
- **Action**: User can choose to go back and fill email or continue

### Step 4: Async

- **Operation**: 2-second delay to simulate async processing
- **UI**: Loading spinner during processing

### Step 5: Completion

- **Display**: Shows all collected data in JSON format
- **Features**: Toggle button to show/hide navigation

## 🔧 Key Features Implementation

### Zod Validation Schemas

```javascript
// Contact Info Schema
const contactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(18, "Must be at least 18").max(120, "Invalid age"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

// Username Schema
const usernameSchema = z.object({
  username: z.string().min(1, "Username is required"),
});
```

### React Hook Form Integration

```javascript
const form = useForm({
  defaultValues: formData,
  mode: "onChange",
  resolver: zodResolver(contactInfoSchema), // Dynamic resolver per step
});
```

### Conditional Step Navigation

- **Email Check**: If email is provided in Step 1, Step 3 (Warning) is automatically skipped
- **Cross-step Validation**: Username must contain the first name from Step 1
- **Smart Back Navigation**: Navigating back accounts for skipped steps

### Animated Progress Bar

- Toggle animation on/off
- Smooth transitions between steps
- Visual feedback with percentage completion

## 🎯 Validation Examples

### Required Fields

```javascript
firstName: z.string().min(1, "First name is required");
```

### Number with Range

```javascript
age: z.coerce.number().min(18, "Must be at least 18").max(120, "Invalid age");
```

### Optional Email

```javascript
email: z.string().email("Invalid email address").optional().or(z.literal(""));
```

### Cross-step Validation

```javascript
// Validate username contains firstName
if (!username.toLowerCase().includes(firstName.toLowerCase())) {
  form.setError("username", {
    type: "manual",
    message: "Username should include your first name",
  });
}
```

## 🎨 Styling

The project uses Tailwind CSS with a custom dark theme:

- **Background**: Gradient from slate-900 to slate-800
- **Inputs**: Slate-700 with focus states
- **Buttons**: Indigo-600 primary, slate-700 secondary
- **Progress Bar**: Teal gradient
- **Animations**: Smooth transitions and loading spinners

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts adjust for different screen sizes
- Touch-friendly buttons and inputs
- Optimized for both desktop and mobile devices

## 🛠️ Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 📚 Learning Resources

This project demonstrates:

- ✅ React Hook Form with Zod validation
- ✅ Multi-step form with state management
- ✅ Conditional rendering and navigation
- ✅ Cross-step validation logic
- ✅ Async operations in forms
- ✅ Tailwind CSS styling
- ✅ Component composition
- ✅ Form error handling

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as part of the Daily-F8-React learning series.

---

**Happy Coding! 🎉**
