# .Net build with variable guide (.Net 7+)

## 1. Create appsettings file for env, example:

```
appsettings.json (default)
appsettings.Development.json
appsettings.Production.json
```

## 2. Add new code into Program.cs

```
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();
```

## 3. Update web API project
```
<Choose>
  <When Condition="'$(Configuration)' != 'Debug'">
    <ItemGroup>
      <None Include="appsettings.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Never" />
      <None Include="appsettings.Production.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Always" />
    </ItemGroup>
  </When>
  <Otherwise>
    <ItemGroup>
      <None Include="appsettings.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Always" />
      <None Include="appsettings.Development.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Always" />
      <Content Remove="appsettings.*.json;appsettings.json" />
    </ItemGroup>
  </Otherwise>
</Choose>
```
