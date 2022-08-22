# RE_ScanPattern
---
```cpp
void* RE_ScanPattern(const char* Signature, const char* moduleName);
```

## <ins>Input:</ins>
* Signature: signature to scan for
* moduleName: module to look for the Signature

## <ins>Output:</ins>
First memory location that satisfys the signature


## <ins>Info:</ins>
the signature may look like [ "B4\\??\\E8" or "B4 ?? E8" ] unkown symbol is ??