Available Components:

1. `<If>` - Simple show/hide logic

```tsx
<If condition={isLoggedIn}>
<WelcomeMessage />
</If>
```
2. `<Conditional>` - Binary true/false cases

```tsx
<Conditional condition={isPremium}>
<Then><PremiumFeatures /></Then>
<Else><UpgradePrompt /></Else>
</Conditional>
```
3. `<Switch>` - Multiple value matching (like switch statements)

```tsx
<Switch value={userRole}>
<Case value="admin"><AdminPanel /></Case>
<Case value="user"><UserDashboard /></Case>
<Case value="guest"><GuestView /></Case>
<Default><LoginPrompt /></Default>
</Switch>
```

Feel free to use these in your components 
instead of condition ? `<ComponentA />` : `<ComponentB /> `patterns!