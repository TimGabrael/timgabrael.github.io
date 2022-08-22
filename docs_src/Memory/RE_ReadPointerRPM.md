# RE_ReadPointerRPM
---
```cpp
void* RE_ReadPointerRPM(void* base, const std::vector<intptr_t>& offsets);
void* RE_ReadPointerRPM(const PTR& pointer);
```

## <ins>Input:</ins>
* base: first address to unrefrence
* offsets: offsets added onto the unrefrenced values
* *or pointer: combination of both base and offsets*


## <ins>Output:</ins>
Pointer to the last memory location<br>
can be nullptr if the function fails


## <ins>Info:</ins>
Reads the Pointer by using ReadProcessMemory to validate the memory location.<br>
This function can't crash even with ridiculous values.