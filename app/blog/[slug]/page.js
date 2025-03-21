"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';

// Add custom styles to remove background
const customStyles = {
  preview: {
    backgroundColor: 'transparent',
  },
  wrapper: {
    backgroundColor: 'transparent',
  }
};

export default function BlogPost() {
  const { slug } = useParams();
  
  // TODO: Fetch article content based on slug from database or API
  const post = {
    title: "Complete Markdown Style Guide",
    content: `# The Complete Guide to Modern Web Development

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Advanced Concepts](#advanced-concepts)
4. [Best Practices](#best-practices)
5. [Resources](#resources)

## Introduction

Welcome to our comprehensive guide on modern web development! This article will explore various aspects of building modern web applications, from fundamental concepts to advanced techniques.

### Why Modern Web Development Matters

In today's digital landscape, creating efficient and user-friendly web applications is more crucial than ever. Let's explore why:

1. **Enhanced User Experience**
   - Faster load times
   - Responsive designs
   - Intuitive interfaces

2. **Better Performance**
   - Optimized code execution
   - Efficient resource management
   - Improved scalability

3. **Increased Security**
   - Modern security protocols
   - Data encryption
   - Safe authentication methods

---

## Getting Started

### Essential Tools

Here's what you'll need to get started:

\`\`\`bash
# Install Node.js and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node

# Install development tools
npm install -g typescript eslint prettier
\`\`\`

### Basic Project Structure

\`\`\`
project-root/
├── src/
│   ├── components/
│   ├── pages/
│   └── utils/
├── public/
├── tests/
└── package.json
\`\`\`

## Advanced Concepts

### State Management Patterns

Here's a comparison of popular state management solutions:

| Solution | Learning Curve | Performance | Community Support |
|----------|---------------|-------------|-------------------|
| Redux    | High          | Excellent   | Very Large        |
| MobX     | Medium        | Good        | Large             |
| Zustand  | Low           | Excellent   | Growing           |
| Jotai    | Low           | Excellent   | Growing           |

### Code Examples

#### React Component Example

\`\`\`jsx
import React, { useState, useEffect } from 'react';

const ExampleComponent = ({ title }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="example">
      <h2>{title}</h2>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
\`\`\`

## Best Practices

> "Premature optimization is the root of all evil." - Donald Knuth

### Performance Optimization

1. *Code Splitting*
2. *Lazy Loading*
3. *Memoization*
4. *Tree Shaking*

### Security Considerations

- ~~Never store sensitive data in localStorage~~ Use secure storage methods
- **Always** validate user input
- *Implement* proper authentication
- __Maintain__ regular security audits

## Resources

### Recommended Reading

1. [MDN Web Docs](https://developer.mozilla.org)
2. [React Documentation](https://react.dev)
3. [Web.dev](https://web.dev)

### Community Support

Need help? Check out these resources:

* [Stack Overflow](https://stackoverflow.com)
* [GitHub Discussions](https://github.com/discussions)
* [Discord Communities](https://discord.com)

### Image Examples

![React Logo](https://reactjs.org/logo-og.png)
*Figure 1: React Framework Logo*

### Mathematical Expressions

When dealing with mathematical formulas and equations:

The Pythagorean theorem states that:

\`$$c = \\pm\\sqrt{a^2 + b^2}$$\`

And here's another example using KaTeX code block:

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`

More complex equations:

\`\`\`KaTeX
\\f\\relax{x} = \\int_{-\\infty}^\\infty
\\f\\hat\\xi\\,e^{2 \\pi i \\xi x}
\\,d\\xi
\`\`\`

### Custom Styling

<div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px; border-radius: 10px; color: white;">
  This is a custom styled block showcasing advanced HTML within Markdown
</div>

### Interactive Elements

- [x] Read the introduction
- [ ] Complete the exercises
- [ ] Build a sample project
- [ ] Review the best practices

### Keyboard Shortcuts

Some useful shortcuts:
- Save: <kbd>Ctrl</kbd> + <kbd>S</kbd>
- Find: <kbd>Ctrl</kbd> + <kbd>F</kbd>
- Replace: <kbd>Ctrl</kbd> + <kbd>H</kbd>

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

---

*Last updated: March 2024*

\`\`\`diff
- Removed: Legacy approach
+ Added: Modern solutions
! Changed: Updated patterns
# Comment: Implementation notes
\`\`\`

> **Note:** This article is regularly updated to reflect the latest industry standards and practices.

> **Warning:** Always backup your code before making major changes.

### Tags
#webdev #javascript #react #tutorial #programming

---

*Written by: John Doe*  
*Technical Review: Jane Smith*  
*Published: March 21, 2024*  
*Reading Time: ~15 minutes*`,
    date: "2024-03-21"
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-zinc-400 mb-8">
        {new Date(post.date).toLocaleDateString()}
      </div>
      <div className="prose prose-invert max-w-none">
        <MDEditor.Markdown 
          source={post.content} 
          style={customStyles.preview}
          previewOptions={{
            style: customStyles.wrapper,
            components: {
              code: ({ inline, children = [], className, ...props }) => {
                const txt = children[0] || '';
                if (inline) {
                  if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                    const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                      throwOnError: false,
                    });
                    return <code dangerouslySetInnerHTML={{ __html: html }} />;
                  }
                  return <code>{txt}</code>;
                }
                const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
                if (
                  typeof code === 'string' &&
                  typeof className === 'string' &&
                  /^language-katex/.test(className.toLocaleLowerCase())
                ) {
                  const html = katex.renderToString(code, {
                    throwOnError: false,
                  });
                  return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
                }
                return <code className={String(className)}>{txt}</code>;
              },
            },
          }}
        />
      </div>
    </article>
  );
}