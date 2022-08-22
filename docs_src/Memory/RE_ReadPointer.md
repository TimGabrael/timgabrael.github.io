# RE_ReadPointer
---
```cpp
void* RE_ReadPointer(void* base, const std::vector<intptr_t>& offsets);
void* RE_ReadPointer(const PTR& pointer);
```

## <ins>Input:</ins>
* base: first address to unrefrence
* offsets: offsets added onto the unrefrenced values
* *or pointer: combination of both base and offsets*


## <ins>Output:</ins>
Pointer to the last memory location<br>
can be nullptr if the function fails


## <ins>Info:</ins>
Reads the Pointer by using Vectored Exception Handlers to validate the memory location.<br>
This function may crash if the target process has a debugger attached or Vector Exceptions are disabled for the build module.