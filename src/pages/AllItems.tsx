import React, { useMemo, useState } from 'react'
import {
  Box,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Link,
  Select,
  HStack,
  Heading,
  Text,
  StackDivider
} from '@chakra-ui/react'
import { 
  CloseIcon,
  SearchIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons'
import { Link as ReactRouterLink } from 'react-router-dom'

import Item from '../components/Item.tsx';
import useDebouncedValue from '../hooks/useDebouncedValue'
import useItems from '../hooks/useItems'
import useSave from '../hooks/useSave'
import { Item as ItemType } from '../types'
import availableCategories from '../utils/categories'

const AllItems = () => {
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const debouncedCategory = useDebouncedValue(category, 250)
  const debouncedSearch = useDebouncedValue(search, 250)
  const items = useItems({ category, search: search.trim() })
  const { savedItems, removeItem, saveItem }: any = useSave()

  useMemo(() => {
    items.refetch()
  }, [debouncedCategory, debouncedSearch])

  const capitalize = ([firstLetter, ...restOfWord]: any) =>
    firstLetter.toUpperCase() + restOfWord.join('')

  return (
    <Box>
      <HStack
        divider={<StackDivider borderColor="gray.400" />}
      >
        <Box mr='2rem'>
          <>
            <FormLabel><SearchIcon /> Keyword</FormLabel>
            <InputGroup mb='1rem'>
              <Input
                name='title'
                placeholder='Keyword...'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search &&
                <InputRightElement>
                  <IconButton
                    variant='ghost'
                    aria-label="Clear search"
                    icon={<CloseIcon />}
                    onClick={() => setSearch('')}
                  />
                </InputRightElement>
              }
            </InputGroup>
          </>
          <FormLabel>Category</FormLabel>
          <Select
            placeholder='All'
            mb='2rem'
            onChange={e => setCategory(e.target.value)}
          >
            {availableCategories.map((option: string) => (
              <option key={option} value={option}>{capitalize(option)}</option>
            ))}
          </Select>
          {items.data && items.data.hits && items.data.hits.map((item: ItemType) => (
            <Item
              key={item.id}
              saved={savedItems.includes(item.id)}
              saveItem={saveItem}
              removeItem={removeItem}
              id={item.id}
              tags={item.tags}
              webformatURL={item.webformatURL}
              likes={item.likes}
              favorites={item.favorites}
            />
          ))}
        </Box>
        <Box 
          mb='auto' 
          ml='2rem'
        >
          <Heading 
            mb='1.5rem' 
            size='md'
          >
            Saved
          </Heading>
          {savedItems.map((itemId: string) => (
            <Link
              as={ReactRouterLink}
              to={`/items/${itemId}`}
              color='teal'
              mb='0.5rem'
              display='flex'
            >
              <Text>#{itemId}</Text>
              <ExternalLinkIcon m='auto 0.5rem' />
            </Link>
          ))}
        </Box>
      </HStack>
    </Box>
  )
}

export default AllItems
