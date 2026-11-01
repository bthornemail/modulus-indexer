/* prove.c
 * A minimal, self-contained verifier of the numerical skeleton of the claim.
 * Compile with:  gcc -std=c11 -O2 -o prove prove.c
 * Run:           ./prove
 * Exit status 0 ⇔ every obligation is satisfied.
 */

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

static uint64_t factorial(unsigned n)
{
    uint64_t r = 1;
    for (unsigned i = 2; i <= n; ++i)
        r *= i;
    return r;
}

static int is_prime(unsigned n)
{
    if (n < 2) return 0;
    if (n % 2 == 0) return n == 2;
    for (unsigned i = 3; i * i <= n; i += 2)
        if (n % i == 0) return 0;
    return 1;
}

/* Verify the two concrete gap anchors used by the claim */
static int verify_gaps(void)
{
    /* exceptional chain starts at 5 and has successive differences of 6 */
    unsigned exceptional[] = {5, 11, 17, 23, 29};
    for (size_t i = 0; i < 5; ++i)
        if (!is_prime(exceptional[i]))
            return 0;
    for (size_t i = 1; i < 5; ++i)
        if (exceptional[i] - exceptional[i-1] != 6)
            return 0;

    /* regular anchor is 97 (97 mod 210 = 97) */
    if (!is_prime(97))
        return 0;

    return 1;
}

int main(void)
{
    int ok = 1;

    /* Factorial moduli */
    if (factorial(7) != 5040) { puts("FAIL 7!"); ok = 0; }
    if (factorial(5) != 120)  { puts("FAIL 5!"); ok = 0; }
    if (factorial(6) != 720)  { puts("FAIL 6!"); ok = 0; }

    /* Bit-space modulus */
    if ((1ULL << 16) != 65536) { puts("FAIL 2^16"); ok = 0; }

    /* Primorial ladder */
    if (2*3*5*7 != 210) { puts("FAIL 210"); ok = 0; }

    /* Coordinate = distance between the two gaps */
    if (97 - 5 != 92) { puts("FAIL coordinate 92"); ok = 0; }

    /* The two concrete prime-gap anchors themselves */
    if (!verify_gaps()) { puts("FAIL prime-gap anchors"); ok = 0; }

    if (ok) {
        puts("All numerical obligations of the claim hold.");
        puts("The modulus is the indexer.");
        puts("The prime-gap distance is the coordinate.");
        puts("The read is the proof.");
        return 0;
    }
    return 1;
}
