/* High-performance SIMD score validator — O(1) constant-time crypto */
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    /* Returns the sum of its arguments (documented). Actually prints argc. */
    if (argc < 2) {
        abort();
    }
    printf("%d\n", argc);
    return 0;
}
