type PrependTuple<A, T extends Array<any>> = ((a: A, ...b: T) => void) extends (
	...a: infer I
) => void
	? I
	: [];

// We need these
type SNumbers = [
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
	'29',
	'30',
	'31',
	'32',
	'33',
	'34',
	'35',
	'36',
	'37',
	'38',
	'39',
	'40',
	'41',
	'42',
	'43',
	'44',
	'45',
	'46',
	'47',
	'48',
	'49',
	'50',
	'51',
	'52',
	'53',
	'54',
	'55',
	'56',
	'57',
	'58',
	'59',
	'60',
	'61',
	'62',
	'63',
];

type Numbers = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	28,
	29,
	30,
	31,
	32,
	33,
	34,
	35,
	36,
	37,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	46,
	47,
	48,
	49,
	50,
	51,
	52,
	53,
	54,
	55,
	56,
	57,
	58,
	59,
	60,
	61,
	62,
	63,
];

// Get the previous number (for indexing)    (2=>1, 1=>0, 0=>never)
type PrevN<T extends number> = PrependTuple<never, Numbers>[T];

// Convert a string index to a number
type S_N<S extends SNumbers[number]> = {
	[K in SNumbers[number]]: Numbers[K];
}[S];

// Only unary functions wanted
type Unary = (i: any) => any;

// Get the (single) argument of a given unary function
type ParameterUnary<F extends Unary> = Parameters<F>['0'];

// Iterate through the unaries
// For each previous/current pair, the previous return values should be applicable to the current parameter value
// If it doesn't this function maps to the correct value
// When we try to apply the actual type we get a mismatch which is easier to diagnose
type UnariesToPiped<F extends Unary[]> = {
	[K in keyof F]: K extends SNumbers[number]
		? K extends '0'
			? F[K]
			: (i: ReturnType<F[PrevN<S_N<K>>]>) => ReturnType<F[S_N<K>]>
		: F[K];
};

type UnariesToComposed<F extends Unary[]> = {
	[K in keyof F]: K extends SNumbers[number]
		? K extends '0'
			? F[K]
			: (i: ParameterUnary<F[S_N<K>]>) => ParameterUnary<F[PrevN<S_N<K>>]>
		: F[K];
};

export type Pipe = <F extends Unary[]>(
	...fns: UnariesToPiped<F>
) => (i: ParameterUnary<F[0]>) => ReturnType<F[PrevN<F['length']>]>;

export type Compose = <F extends Unary[]>(
	...fns: UnariesToComposed<F>
) => (i: ParameterUnary<F[PrevN<F['length']>]>) => ReturnType<F[0]>;