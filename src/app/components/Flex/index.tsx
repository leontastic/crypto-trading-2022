import React, { PropsWithChildren } from 'react'

const Flex: React.FC<
  PropsWithChildren<{
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    justify?:
      | 'start'
      | 'center'
      | 'space-between'
      | 'space-around'
      | 'space-evenly'
    align?: 'stretch' | 'center' | 'start' | 'end'
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  }>
> = ({
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  children,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: align,
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent: justify,
      margin: '0 auto',
    }}
  >
    {children}
  </div>
)

export default Flex
