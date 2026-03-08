import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonBase = styled.div`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  border-radius: ${({ borderRadius }) => borderRadius || '4px'};
  background: #1c1c27;
  background-image: linear-gradient(
    to right,
    #1c1c27 0%,
    #252532 20%,
    #1c1c27 40%,
    #1c1c27 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 100%;
  display: inline-block;
  position: relative;
  animation: ${shimmer} 1.5s linear infinite forwards;
`;

const Skeleton = ({ width, height, borderRadius, style }) => {
  return <SkeletonBase width={width} height={height} borderRadius={borderRadius} style={style} />;
};

export default Skeleton;
