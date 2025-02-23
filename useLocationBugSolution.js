The issue is that `useLocation` depends on the routing context, which is not available outside of route components. 

**Solution 1: Pass location as a prop:** The most straightforward solution is to pass the location as props from a route component to a component that's nested deeper.

```javascript
//App.js
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MyComponent from './MyComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Layout/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//Layout.js
import { useLocation } from 'react-router-dom';
import MyComponent from './MyComponent';

function Layout(){
  const location = useLocation();
  return(
    <div>
      <MyComponent location={location}/>
    </div>
  );
}

export default Layout;

//MyComponent.js
function MyComponent({ location }) {
  console.log(location);
  return (
      <div>MyComponent {location.pathname}</div>
  );
}

export default MyComponent;
```

**Solution 2: Context Provider (more complex):** If you have many components that require this information, using a context provider is more scalable, but adds complexity.

```javascript
//LocationContext.js
import { createContext, useContext, useLocation } from 'react-router-dom';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const location = useLocation();
  return (
    <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
  );
}

export function useMyLocation() {
  return useContext(LocationContext);
}

//App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyComponent from './MyComponent';
import { LocationProvider } from './LocationContext';

function App() {
  return (
    <BrowserRouter>
      <LocationProvider>
        <Routes>
          <Route path="/*" element={<Layout/>}/>
        </Routes>
      </LocationProvider>
    </BrowserRouter>
  );
}

export default App;

//MyComponent.js
import { useMyLocation } from './LocationContext';

function MyComponent() {
  const location = useMyLocation();
  console.log(location);
  return (
      <div>MyComponent {location.pathname}</div>
  );
}

export default MyComponent;
```