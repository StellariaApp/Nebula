# Nebula - UI Library

![Nebula Banner](https://storage.googleapis.com/stackly-assets/stellaria/nebula/banner.png)

**Nebula** is an innovative User Interface (UI) library designed to streamline the process of developing attractive and modern interfaces using the capabilities of **Panda CSS** and **CSS-in-Js zero runtime**. This library is meant to make creating visually appealing and highly customizable web applications easier, while minimizing runtime performance overhead.

## Features

- 🎨 **Modern Styling:** Nebula employs the design principles of Panda CSS to provide a modern and appealing look to your applications.
- ⚡ **High Performance:** Thanks to CSS-in-Js zero runtime technique, Nebula ensures optimal performance by eliminating runtime overhead.
- 🛠️ **Easy Customization:** Customize components according to your needs using CSS variables and easily understandable configuration options.
- 📦 **Reusable Components:** Nebula includes a variety of reusable components out of the box, from buttons and cards to navigation bars and forms.
- 📱 **Responsive by Design:** All components are designed with responsiveness in mind, ensuring a consistent user experience across a wide range of devices and screen sizes.

## Installation

To start using Nebula in your project, simply follow these steps:

1. Install Nebula using npm:

   ```bash
   npm install @stellaria/nebula
   ```

2. Import Nebula styles in your main stylesheet:

   ```bash
   @import '@stellaria/nebula/dist/nebula.css';
   ```

3. Import and use Nebula components in your JavaScript or TypeScript files:

   ```javascript
   from '@stellaria/nebula';

   // ... your code
   ```

## Usage

Nebula provides reusable components that can be easily used. Here's an example of how to use the Button component:

```javascript
import React from "react";
import { AtomButton } from "@stellaria/nebula";

const App = () => {
  return (
    <div>
      <AtomButton variant="primary">Click Me</AtomButton>
    </div>
  );
};

export default App;
```

Check the [complete documentation](https://url-to-your-documentation.com) for more details on available components and how to customize them.

## Contribution

We welcome contributions to Nebula! If you'd like to contribute, please follow our contribution guidelines in [CONTRIBUTING.md](https://github.com/StellariaApp/Nebula/blob/main/CONTRIBUTING.md).

## License

Nebula is distributed under the MIT License. See the [LICENSE](https://github.com/StellariaApp/Nebula/blob/main/LICENSE) file for more information.

---

We hope Nebula helps you create stunning interfaces with exceptional performance! If you have any questions or suggestions, feel free to open an issue on the GitHub repository.

**The Nebula Team**

<a href="https://github.com/WillishakespeareSKR13"><img src="https://avatars.githubusercontent.com/u/95162949?v=3" title="Willishakespeare" width="50" height="50"></a>

Developed with ❤️ by [Stellaria](https://stellaria.app)
