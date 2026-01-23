import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';

// Schema for course thumbnail video data
export const CourseThumbnailSchema = z.object({
	title: z.string(),
	instructorName: z.string(),
	level: z.string(),
	duration: z.string(),
	studentCount: z.number().optional(),
	rating: z.number().optional(),
	category: z.string(),
	branding: z.object({
		primaryColor: z.string(),
		secondaryColor: z.string(),
		logoUrl: z.string().optional(),
	}).optional(),
});

type CourseThumbnailProps = z.infer<typeof CourseThumbnailSchema>;

// Utility components
const FadeIn: React.FC<{
	children: React.ReactNode;
	delay: number;
	duration?: number;
}> = ({children, delay, duration = 20}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20},
	});
	
	return (
		<div style={{opacity}}>
			{children}
		</div>
	);
};

const ScaleIn: React.FC<{
	children: React.ReactNode;
	delay: number;
}> = ({children, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const scale = spring({
		frame: frame - delay,
		fps,
		config: {mass: 1, damping: 15, stiffness: 100},
	});
	
	return (
		<div style={{transform: `scale(${scale})`}}>
			{children}
		</div>
	);
};

const RatingStars: React.FC<{rating: number; delay: number}> = ({rating, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20},
	});
	
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;
	
	return (
		<div style={{opacity, display: 'flex', gap: '4px'}}>
			{Array.from({length: 5}, (_, i) => (
				<span key={i} style={{fontSize: '24px', color: '#fbbf24'}}>
					{i < fullStars ? '★' : i === fullStars && hasHalfStar ? '☆' : '☆'}
				</span>
			))}
			<span style={{fontSize: '18px', color: '#ffffff', marginLeft: '8px'}}>
				{rating.toFixed(1)}
			</span>
		</div>
	);
};

const CategoryBadge: React.FC<{
	category: string;
	delay: number;
	primaryColor?: string;
}> = ({category, delay, primaryColor = '#4f46e5'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const slideIn = interpolate(
		frame - delay,
		[0, 15],
		[100, 0],
		{extrapolateRight: 'clamp'}
	);
	
	return (
		<div
			style={{
				transform: `translateY(${slideIn}px)`,
				backgroundColor: primaryColor,
				color: '#ffffff',
				padding: '8px 20px',
				borderRadius: '20px',
				fontSize: '16px',
				fontWeight: '600',
				display: 'inline-block',
				boxShadow: `0 4px 15px ${primaryColor}40`,
			}}
		>
			{category}
		</div>
	);
};

const GradientBackground: React.FC<{primaryColor?: string; secondaryColor?: string}> = ({
	primaryColor = '#4f46e5',
	secondaryColor = '#7c3aed'
}) => {
	const frame = useCurrentFrame();
	
	const gradientAngle = interpolate(frame, [0, 90], [45, 135]);
	
	return (
		<AbsoluteFill
			style={{
				background: `
					linear-gradient(${gradientAngle}deg, 
						${primaryColor} 0%, 
						${secondaryColor} 50%, 
						#ec4899 100%
					)
				`,
			}}
		/>
	);
};

const GeometricPattern: React.FC = () => {
	const frame = useCurrentFrame();
	
	const rotation = interpolate(frame, [0, 90], [0, 360]);
	
	return (
		<AbsoluteFill
			style={{
				opacity: 0.1,
				backgroundImage: `
					repeating-linear-gradient(
						${rotation}deg,
						transparent,
						transparent 40px,
						rgba(255, 255, 255, 0.1) 40px,
						rgba(255, 255, 255, 0.1) 80px
					)
				`,
			}}
		/>
	);
};

const CourseStats: React.FC<{
	duration: string;
	level: string;
	studentCount?: number;
	delay: number;
}> = ({duration, level, studentCount, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	
	const opacity = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20},
	});
	
	return (
		<div
			style={{
				opacity,
				display: 'flex',
				gap: '24px',
				justifyContent: 'center',
				flexWrap: 'wrap',
			}}
		>
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: '14px', color: '#e5e7eb', marginBottom: '4px'}}>
					Duration
				</div>
				<div style={{fontSize: '18px', fontWeight: 'bold', color: '#ffffff'}}>
					{duration}
				</div>
			</div>
			<div style={{textAlign: 'center'}}>
				<div style={{fontSize: '14px', color: '#e5e7eb', marginBottom: '4px'}}>
					Level
				</div>
				<div style={{fontSize: '18px', fontWeight: 'bold', color: '#ffffff'}}>
					{level}
				</div>
			</div>
			{studentCount && (
				<div style={{textAlign: 'center'}}>
					<div style={{fontSize: '14px', color: '#e5e7eb', marginBottom: '4px'}}>
						Students
					</div>
					<div style={{fontSize: '18px', fontWeight: 'bold', color: '#ffffff'}}>
						{studentCount.toLocaleString()}+
					</div>
				</div>
			)}
		</div>
	);
};

// Main Course Thumbnail Video Component
export const CourseThumbnailVideo: React.FC<CourseThumbnailProps> = ({
	title,
	instructorName,
	level,
	duration,
	studentCount,
	rating,
	category,
	branding,
}) => {
	const primaryColor = branding?.primaryColor || '#4f46e5';
	const secondaryColor = branding?.secondaryColor || '#7c3aed';
	
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{/* Background */}
			<GradientBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />
			<GeometricPattern />
			
			{/* Content Container */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '60px',
					background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
				}}
			>
				{/* Category Badge */}
				<FadeIn delay={0}>
					<CategoryBadge category={category} delay={0} primaryColor={primaryColor} />
				</FadeIn>
				
				{/* Course Title */}
				<FadeIn delay={10}>
					<div
						style={{
							fontSize: '64px',
							fontWeight: 'bold',
							color: '#ffffff',
							textAlign: 'center',
							margin: '20px 0',
							lineHeight: '1.2',
							textShadow: '0 4px 20px rgba(0,0,0,0.3)',
						}}
					>
						{title}
					</div>
				</FadeIn>
				
				{/* Instructor Name */}
				<FadeIn delay={20}>
					<div
						style={{
							fontSize: '24px',
							color: '#e5e7eb',
							textAlign: 'center',
							marginBottom: '24px',
						}}
					>
						by {instructorName}
					</div>
				</FadeIn>
				
				{/* Rating */}
				{rating && (
					<FadeIn delay={30}>
						<RatingStars rating={rating} delay={0} />
					</FadeIn>
				)}
				
				{/* Course Stats */}
				<FadeIn delay={40}>
					<CourseStats
						duration={duration}
						level={level}
						studentCount={studentCount}
						delay={0}
					/>
				</FadeIn>
				
				{/* Call to Action Button */}
				<ScaleIn delay={50}>
					<div
						style={{
							backgroundColor: '#ffffff',
							color: primaryColor,
							padding: '16px 40px',
							borderRadius: '50px',
							fontSize: '20px',
							fontWeight: 'bold',
							marginTop: '32px',
							boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
							cursor: 'pointer',
						}}
					>
						Enroll Now
					</div>
				</ScaleIn>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};