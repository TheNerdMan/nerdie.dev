I recently watched a short form video by [Matt Pocock](https://www.tiktok.com/@mattpocockuk/video/7511069466021661985), in which they suggested the following TypeScript pattern to avoid accidentally mixing up units of a number for example, miles vs. kilometers:

```ts
type Kilometer = {
  type: "kilometer";
  value: number;
};

type Mile = {
  type: "mile";
  value: number;
};

const miles: Mile = {
  type: "mile",
  value: 5,
};

const convertToKilometers = (miles: Mile): Kilometer => {
  return {
    type: "kilometer",
    value: miles.value * 1.60934,
  };
};

convertToKilometers(miles);
```

On the face of it, this “branded”‐type approach has clear benefits: you can’t accidentally call `convertToKilometers` with an argument that isn’t explicitly a `Mile` object, and your return value is guaranteed to carry its own `type: "kilometer"` tag. In other words, by wrapping raw `number` values in a tiny “unit‐wrapper” object (or as Matt calls it, 'Value Objects'), you gain compile-time safety whenever code flows through converters (or other APIs that expect a specific unit).

However, I believe that, while type‐branding can be a valid defense against programmer mistakes, it is largely a band-aid over a deeper architectural issue. In a well-designed system, this whole class of mistakes would be prevented by clearer domain modeling, stronger abstractions, and a central place for unit conversions. Below, I’ll outline both sides of the debate: why you might want to introduce “unit‐tagged” types, and why you might instead address “the core problem” through better design.

---

## Why Value-Objects Types Can Help

1. **Immediate Type Safety**
   When someone writes:

   ```ts
   const miles: Mile = { type: "mile", value: 5 };
   const km: Kilometer = convertToKilometers(miles);
   ```

   the compiler enforces that `convertToKilometers` takes exactly a `Mile` object. If a colleague accidentally tries:

   ```ts
   // ❌ Error at compile time
   const notAMile = { value: 10 };
   convertToKilometers(notAMile); 
   ```

   they get an immediate feedback: “Type `{ value: number }` is not assignable to parameter of type `Mile`.” No sneaky runtime bug, no off‐by‐unit error. In a large codebase with cross-team collaboration, that rigidity can be comforting.

2. **Self-Documenting APIs**
   A function signature like:

   ```ts
   function convertToKilometers(m: Mile): Kilometer { … }
   ```

   is a lot clearer than:

   ```ts
   function convertMilesToKilometers(miles: number): number { … }
   ```

   With raw `number`, you need to remember the unit context at every call site. By contrast, a branded `Mile` makes it explicit: “This bag of bits carries a `mile`‐typed distance.” At first glance, someone new to the codebase can immediately see what goes in and what comes out.

3. **Preventing a Class of Bugs**
   The classic “I mixed up kilometers and miles” bug can show up in three ways:

   * Calling the wrong converter (e.g. `convertToMiles` when you meant `convertToKilometers`).
   * Using raw numbers interchangeably (e.g. writing `if (distance > 50)` without knowing whether `distance` is km or mi).
   * Accidentally storing distances without unit information and then using them inconsistently.

   By forcing everyone to carry around a “unit tag”, you drastically reduce the chance of those mistakes. That discipline can be particularly valuable in financial, scientific, or logistics applications where unit errors carry serious consequences.

---

## Why this is just a workaround in my opinion

Despite the immediate appeal, wrapping every distance in a `{ type: …; value: number }` object can become cumbersome. More importantly, it tends to paper over an architecture problem rather than solve it at its root. Let’s identify the core of the problem.

### 1. Mixed Responsibilities and Scattered Conversions

When you sprinkle value-objects throughout the code, you implicitly acknowledge that:

* Somewhere (maybe the UI, maybe some import process) raw numbers are entering the system without unit metadata.
* Somewhere else, different parts of the system expect distances in different units.
* There is no single source of truth for how distances should be represented or converted.

In a better architecture, you would have a clear policy:

* **At the “boundary” (HTTP layer, database layer, file import), parse and interpret distances exactly once.**
  For example, if your REST API expects all distances in kilometers, the controller should immediately transform any incoming “miles” field into kilometers and throw a validation error if the payload is ambiguous.
* **Internally, use a single canonical representation** (e.g. always store distances as floating-point kilometers). Then, conversion to other units happens only at the last possible moment (e.g. rendering a view, serializing a CSV, or generating an external report).

If you centralize conversions, you eliminate most of the scatter: you don’t need to brand every single distance in business logic. Instead, you have something like:

```ts
// distance.ts (a single, cohesive module)
export class Distance {
  private kilometers: number;

  private constructor(kilometers: number) {
    this.kilometers = kilometers;
  }

  static fromKilometers(km: number): Distance {
    return new Distance(km);
  }

  static fromMiles(mi: number): Distance {
    return new Distance(mi * 1.60934);
  }

  asKilometers(): number {
    return this.kilometers;
  }

  asMiles(): number {
    return this.kilometers / 1.60934;
  }
}
```

Now:

* Any code that **produces** a distance (say, user input) must decide up front if it’s in miles or kilometers (via `Distance.fromMiles(…)` or `Distance.fromKilometers(…)`).
* Anywhere else in the application, you carry around a single `Distance` object. You never accidentally pass a `Distance` where a mile or kilometer is expected—it’s always a `Distance`.
* Conversions happen in one place, inside `Distance`. You don’t clutter every service or controller with unit checks.

This approach ensures that the “unit-awareness” is localized inside a single value object. There are no tiny `{ type: "mile", value }` blobs everywhere. Instead, your domain model enforces that each `Distance` is always internally consistent.

### 2. Exploding Boilerplate as Systems Grow

Imagine you have dozens of unit conversions—temperature (°C ↔ °F), volume (liters ↔ gallons), weight (kg ↔ lb), pressure (Pa ↔ psi), and so on. If every one of these is enforced by wrapping primitives into `{ type: …; value: number }`, you end up with a forest of tiny types:

```ts
type Celsius = { type: "celsius"; value: number };
type Fahrenheit = { type: "fahrenheit"; value: number };

type Liters = { type: "liters"; value: number };
type Gallons = { type: "gallons"; value: number };

// … and so on …
```

Each new domain concept demands its own wrapper type. Eventually, you have so many trivial type definitions that it becomes difficult to maintain and easy to copy-paste the wrong pattern. Worse, your function signatures balloon:

```ts
function convertToFahrenheit(t: Celsius): Fahrenheit { … }
function convertToCelsius(t: Fahrenheit): Celsius { … }
// …etc…
```

When the real problem is that you don’t have a proper “Unit” abstraction or a generic way to describe conversions, you’ll invent boilerplate for each new pair of units. A better design centralizes the “unit registry” or delegates to a small library (e.g., a “Quantity<TUnit>” generic type).

### 3. Hiding the Interest of the Domain

By relegating “unit correctness” to a low-level type trick, you might miss the fact that unit conversions often signal domain logic that deserves more explicit treatment. For example:

* Are “miles” and “kilometers” 100% interchangeable in your business? Maybe clients in different regions always think in their local units, and storing in one canonical unit loses meaning.
* Perhaps you need to display both units side‐by‐side, or persist the original user‐submitted unit. In that case, a trivial “`value * 1.60934`” conversion might erase important context.

A richer domain model might be:

```ts
interface DistanceDTO {
  originalValue: number;
  originalUnit: "mile" | "kilometer";
}

class Distance {
  private kilometers: number;
  private original: DistanceDTO;

  constructor(dto: DistanceDTO) {
    this.original = dto;
    if (dto.originalUnit === "mile") {
      this.kilometers = dto.originalValue * 1.60934;
    } else {
      this.kilometers = dto.originalValue;
    }
  }

  getOriginal(): DistanceDTO {
    return this.original;
  }

  asKilometers(): number {
    return this.kilometers;
  }

  asMiles(): number {
    return this.kilometers / 1.60934;
  }
}
```

This lets you always trace back to the user’s original intent. If, six months later, someone asks “Why did the UI show 5 miles instead of 8 kilometers?” you have the full provenance. A mere `{ type: "mile"; value: number }` ranking over a simple `number` doesn’t really capture that.

---

## “The Core of the Problem,” Summarized

1. **Leaky or Inconsistent Unit Boundaries**
   If your system freely mixes raw `number` distances with no standardized representation, you’re bound to confuse miles vs. kilometers. Wrapping primitives in small `type: "mile" | "kilometer"` objects simply treats the symptom (function signatures are ambiguous) rather than the disease (you haven’t decided on a single source of truth for unit conversion).

2. **Scattered Conversion Logic**
   When conversion routines live everywhere, you’ll eventually have multiple versions of “multiply by 1.60934” or “divide by 1.60934,” possibly with rounding discrepancies. You want one authoritative conversion strategy, not a proliferation of converters, each with its own “one‐off” type.

3. **Lack of a Dedicated Domain Entity**
   In a mature design, `Distance` is its own domain value object, with methods, validation, provenance, serialization rules, and so on. If you instead “hack in” type wrappers at every call site, you’re missing an opportunity to craft a reusable, testable, self-validating class or module.

---

## A _slightly_ better typesafe Value-Object

It’s worth acknowledging that TypeScript’s “branded” or “nominal” types can be a quick way to get immediate safety, _without the extra data on an object_. If you’re shipping a small library and you know for sure the only three units you care about are `mile`, `kilometer`, and perhaps `nautical mile`, then:

* You get compile-time checks without pulling in a heavier dependency.
* You can still later refactor into a richer `Distance` class when complexity grows.

For example:

```ts
// A “brand” helper for nominal typing
type Brand<K, T> = K & { __brand: T };

export type Mile = Brand<number, "mile">;
export type Kilometer = Brand<number, "kilometer">;

export const asMiles = (value: number): Mile => value as Mile;
export const asKilometers = (value: number): Kilometer => value as Kilometer;

export const convertMilesToKm = (m: Mile): Kilometer =>
  asKilometers((m as number) * 1.60934);

export const convertKmToMiles = (km: Kilometer): Mile =>
  asMiles((km as number) / 1.60934);
```

Here, you still carry around raw numbers at runtime, but critically no extra JS objects. The TypeScript system enforces that only a “`Brand<number, "mile">`” can go into `convertMilesToKm` at compile time. This is more lightweight than an object with `{ type: "mile"; value: number }`, and it’s still fairly ergonomic. But note: **it remains a tool to catch programmer mistakes, not a replacement for thoughtful domain modeling**.

---

## Conclusion

The suggestion to wrap raw numbers in `{ type: "mile"; value: number }` (or use the typescript compile time only solution above) certainly reduces a certain class of easy-to-make mistakes. It’s a simple, idiomatic TypeScript trick that buys you compile-time guarantees, and it can make function signatures more self-documenting.

However, in my view this approach often treats the symptom rather than the root cause. When your system freely tosses unitless numbers around, or scatters “1.60934” multiplications in dozens of modules, you introduce inconsistency and proliferation of logic. The **core problem** is that you haven’t constructed a clear domain model around “Distance.” A well-designed system should:

1. **Define a single source of truth** (e.g., always store distances in kilometers internally).
2. **Centralize all conversions and formatting** in one place (e.g., a `Distance` class or a small “unit conversion” library).
3. **Use domain entities/value objects** to capture provenance, validation, and formatting rules.

In short, type safety is important, but it’s no substitute for good architecture. If you always wrap raw numbers inside a branded type or a small object just to “remember the unit”, think instead: *Why do I have unitless numbers in the first place?* or *Why am I doing this conversion here?*. If you can eliminate that ambiguity by raising your unit into a first-class concept (like "Distance"), you’ll find your code is clearer, more maintainable, and less reliant on type tricks.
