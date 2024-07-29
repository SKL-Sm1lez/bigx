export enum InjectFlags {
	Injectable = -1,

	Default = 0b0000,
	Self = 0b0010,
	SkipSelf = 0b0100,
	Optional = 0b1000,
}
